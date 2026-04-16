import { storage } from '../storage';

// Método que conclui uma tarefa
export async function doWork(taskClassroomId: string): Promise<boolean> {
    const data = await storage.getData();
    if (!data) return false;

    const taskIndex = data.tasks.findIndex(t => t.classroom_id === taskClassroomId);
    if (taskIndex === -1) return false;

    const task = data.tasks[taskIndex];
    if (task.status === 'completed') {
        return false;
    }

    task.status = 'completed';
    task.completed_at = new Date().toISOString();

    data.tasks[taskIndex] = task;
    await storage.setData(data);
    return true;
}

// Méto que adicona um colega na tarefa
export async function addPeer(
    taskClassroomId: string,
    peerInfo: { google_id: string; name: string; email?: string }
): Promise<boolean> {
    const data = await storage.getData();
    if (!data) return false;

    const taskExists = data.tasks.some(t => t.classroom_id === taskClassroomId);
    if (!taskExists) return false;

    let changed = false;

    let peer = data.peers.find(p => p.google_id === peerInfo.google_id);
    if (!peer) {
        peer = {
            google_id: peerInfo.google_id,
            name: peerInfo.name,
            email: peerInfo.email,
        };
        data.peers.push(peer);
        changed = true;
    }

    const existingLink = data.taskPeers.find(
        tp => tp.task_classroom_id === taskClassroomId && tp.peer_google_id === peerInfo.google_id
    );
    if (!existingLink) {
        data.taskPeers.push({
            task_classroom_id: taskClassroomId,
            peer_google_id: peerInfo.google_id,
        });
        changed = true;
    }

    if (changed) {
        await storage.setData(data);
    }
    return changed;
}