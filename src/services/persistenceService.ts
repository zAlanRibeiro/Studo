import { ProcessedTask } from '../hooks/useClassroomData';
import { storage, StoredTask } from '../storage';

function convertTaskToStored(task: ProcessedTask): StoredTask {
    return {
        classroom_id: task.id,
        title: task.title,
        status: task.isCompleted ? 'completed' : 'pending',
        due_date: task.deadlineLabel,
        materia: task.materia,
        description: task.description,
        urgency: task.urgency,
        raw_date: task.rawDate.toISOString(),
    };
}

export async function saveTasksToStorage(tasks: ProcessedTask[]): Promise<void> {
    const storedTasks = tasks.map(convertTaskToStored);
    const currentData = await storage.getData();
    const newData = {
        tasks: storedTasks,
        peers: currentData?.peers ?? [],
        taskPeers: currentData?.taskPeers ?? [],
        badges: currentData?.badges ?? [],
        userBadges: currentData?.userBadges ?? [],
    };
    await storage.setData(newData);
}

export async function loadTasksFromStorage(): Promise<StoredTask[]> {
    const data = await storage.getData();
    return data?.tasks ?? [];
}