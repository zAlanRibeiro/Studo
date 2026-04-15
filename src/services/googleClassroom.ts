import { apiRequest } from "./api";

// Tipagem do curso
export interface GoogleCourse {
    id: string;
    name: string;
    section?: string;
    courseState?: 'ACTIVE' | 'ARCHIVED';
}

// Tipagem dos traballhos do curso
export interface GoogleCourseWork {
  courseId: string;
  id: string;
  title: string;
  description?: string;
  creationTime: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints?: number;
  workType?: string;
}

// Tipagem das submissões de trabalhos
export interface GoogleSubmission {
  id: string;
  courseWorkId: string;
  userId: string;
  state: 'NEW' | 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT';
  assignedGrade?: number;
}

export interface CoursesResponse {
  courses?: GoogleCourse[];
  nextPageToken?: string;
}

export interface CourseWorkResponse {
  courseWork?: GoogleCourseWork[];
  nextPageToken?: string;
}

export interface SubmissionsResponse {
  studentSubmissions?: GoogleSubmission[];
  nextPageToken?: string;
}

// Método que mostra os cursos ativos do usuário
export async function getActiveCourses(token: string): Promise<GoogleCourse[]> {
    const data = await apiRequest<CoursesResponse>('/courses?courseStates=ACTIVE', token);
    return data.courses || [];
}

// Método que pega todas atividades de um curso
export async function getCourseWorks(
    token:string,
    courseId: string

): Promise<GoogleCourseWork[]> {
    const data = await apiRequest<CourseWorkResponse>(`/courses/${courseId}/courseWork`, token);
    return data.courseWork || [];
}

// Método que pega todas as entregas do usuário em um curso
export async function getStudentSubmissions(
  token: string,
  courseId: string
): Promise<GoogleSubmission[]> {
  const data = await apiRequest<SubmissionsResponse>(`/courses/${courseId}/courseWork/-/studentSubmissions?userId=me`, token);
  return data.studentSubmissions || [];
}