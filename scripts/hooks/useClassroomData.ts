import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { getActiveCourses, getCourseWorks, getStudentSubmissions, GoogleCourseWork } from '../services/googleClassroom';

WebBrowser.maybeCompleteAuthSession();

// Tipagem da tarefa processada
export interface ProcessedTask {
    id: string;
    title: string;
    materia: string;
    description: string;
    isCompleted: boolean;
    isExpired: boolean;
    isVeryOld: boolean;
    urgency: 'red' | 'yellow' | 'green' | 'none';
    rawDate: Date;
    deadlineLabel: string | null;
}

// Configuração do token
const GOOGLE_CLIENT_IDS = {
    clientId: '990267192314-h2lhq3dp81s1lh8prju7i7tg8n74knfv.apps.googleusercontent.com',
    androidClientId: '990267192314-jgnd7f59garagsl8asvuoikgbknjcqrp.apps.googleusercontent.com'
};

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly'
];

// Método que formata a data
function formatDeadline(
    dueDate?: GoogleCourseWork['dueDate'],
    dueTime?: GoogleCourseWork['dueTime']
): string | null {
    if (!dueDate) return null;
    const day = String(dueDate.day).padStart(2, '0');
    const month = String(dueDate.month).padStart(2, '0');
    const hours = dueTime?.hours ? String(dueTime.hours).padStart(2, '0') : '23';
    const minutes = dueTime?.minutes ? String(dueTime.minutes).padStart(2, '0') : '59';
    return `${day}/${month} às ${hours}:${minutes}`;
}

// Método que processa as atividades de forma crua
function processTasks(
    courses: { id: string; name: string }[],
    courseWorks: GoogleCourseWork[],
    submissionsMap: Record<string, boolean>
): ProcessedTask[] {
    const now = new Date();
    const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

    return courseWorks.map((work) => {
        const isCompleted = submissionsMap[work.id] || false;
        const hasDeadline = !!work.dueDate;
        const expirationDate = hasDeadline ? new Date(work.dueDate!.year, work.dueDate!.month - 1,
            work.dueDate!.day, work.dueTime?.hours || 23, work.dueTime?.minutes || 59) : new Date(9999, 11, 31);
        const isExpiredByDeadline = hasDeadline && expirationDate < now;
        const creationDate = new Date(work.creationTime);
        const isExpiredByAge = (now.getTime() - creationDate.getTime()) > ONE_YEAR_IN_MS;
        const isExpired = !isCompleted && (isExpiredByDeadline || isExpiredByAge);

        let urgency: ProcessedTask['urgency'] = 'none';
        if (hasDeadline && !isCompleted && !isExpired) {
            const msPerDay = 1000 * 60 * 60 * 24;
            const daysRemaining = (expirationDate.getTime() - now.getTime()) / msPerDay;
            if (daysRemaining <= 7) {
                urgency = 'red';
            } else if (daysRemaining < 14) {
                urgency = 'yellow';
            } else {
                urgency = 'green';
            }
        }

        const course = courses.find((c) => c.id === work.courseId) || { name: 'Desconhecida' };

        return {
            id: work.id,
            title: work.title,
            materia: course.name,
            description: work.description || 'Sem descrição.',
            isCompleted,
            isExpired,
            isVeryOld: isExpiredByAge && !isExpiredByDeadline,
            urgency,
            rawDate: expirationDate,
            deadlineLabel: formatDeadline(work.dueDate, work.dueTime),
        };
    });
}

interface UseClassroomDataReturn {
    isAuthenticated: boolean;
    accessToken: string | null;
    promptAsync: () => void;
    isLoadingAuth: boolean;

    // Dados
    tasks: ProcessedTask[];
    isLoading: boolean;
    isRefreshing: boolean;

    // Ações
    refresh: () => Promise<void>;
    logout: () => void;
}

// Método que cuida da questão de login
export function useClassroomData(): UseClassroomDataReturn {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tasks, setTasks] = useState<ProcessedTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        ...GOOGLE_CLIENT_IDS,
        extraParams: { prompt: 'select_account' },
        scopes: SCOPES,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            setAccessToken(authentication!.accessToken);
        }
    }, [response]);

    const fetchData = useCallback(
        async (token: string, isRefresh = false) => {
            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            try {
                const courses = await getActiveCourses(token);
                const allWorksPromises = courses.map(async (course) => {
                    const [works, submissions] = await Promise.all([
                        getCourseWorks(token, course.id),
                        getStudentSubmissions(token, course.id),
                    ]);

                    const submissionsMap: Record<string, boolean> = {};
                    submissions.forEach((sub) => {
                        submissionsMap[sub.courseWorkId] =
                            sub.state === 'TURNED_IN' || sub.state === 'RETURNED';
                    });

                    return { course, works, submissionsMap };
                });

                const results = await Promise.all(allWorksPromises);
                const allProcessedTasks: ProcessedTask[] = [];
                results.forEach(({ course, works, submissionsMap }) => {
                    const processed = processTasks(
                        [{ id: course.id, name: course.name }],
                        works.map((w) => ({ ...w, courseId: course.id })),
                        submissionsMap
                    );
                    allProcessedTasks.push(...processed);
                });

                allProcessedTasks.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
                setTasks(allProcessedTasks);
            } catch (error) {
                console.error('Erro ao buscar dados do Classroom:', error);
                if (error instanceof Error && error.message.includes('401')) {
                    setAccessToken(null);
                }
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        }, []
    );

    useEffect(() => {
        if (accessToken) {
            fetchData(accessToken, false);
        }
    }, [accessToken, fetchData]);

    const refresh = useCallback(async () => {
        if (accessToken) {
            await fetchData(accessToken, true);
        }
    }, [accessToken, fetchData]);

    const logout = useCallback(() => {
        setAccessToken(null);
        setTasks([]);
    }, []);

    return {
        isAuthenticated: !!accessToken,
        accessToken,
        promptAsync,
        isLoadingAuth: !request,

        tasks,
        isLoading,
        isRefreshing,

        refresh,
        logout,
    };
}