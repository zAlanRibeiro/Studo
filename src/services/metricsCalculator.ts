import { AppStorageData, Metrics } from '../storage';

// Método que calcula as métricas
export function calculateMetrics(data: AppStorageData): Metrics {
    const { tasks, peers, taskPeers } = data;

    const totalCompletedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalPeersAdded = peers.length;
    const tasksWithPeers = new Set(taskPeers.map(tp => tp.task_classroom_id));
    const tasksWithPeersCount = tasksWithPeers.size;

    // Tarefas concluídas dentro do prazo
    const tasksCompletedOnTimeCount = tasks.filter(task => {
        if (task.status !== 'completed' || !task.completed_at) return false;
        if (!task.due_date) return false;

        const completedDate = new Date(task.completed_at);
        // raw_date é a data limite em ISO (se existir)
        if (!task.raw_date) return false;
        const dueDate = new Date(task.raw_date);

        return completedDate <= dueDate;
    }).length;

    return {
        totalCompletedTasks,
        totalPeersAdded,
        tasksWithPeersCount,
        tasksCompletedOnTimeCount,
    };
}