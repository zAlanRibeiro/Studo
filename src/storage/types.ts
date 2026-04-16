export interface StoredTask {
    classroom_id: string;
    title: string;
    status: 'pending' | 'completed';
    due_date: string | null;
    completed_at?: string | null;
    materia?: string;
    description?: string;
    urgency?: 'red' | 'yellow' | 'green' | 'none';
    raw_date?: string;
}

export interface StoredPeer {
    google_id: string;
    name: string;
    email?: string;
}

export interface StoredTaskPeer {
    task_classroom_id: string;
    peer_google_id: string;
}

export interface StoredBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface StoredUserBadge {
    badge_id: string;
    earned_at: string;
}

export interface AppStorageData {
    tasks: StoredTask[];
    peers: StoredPeer[];
    taskPeers: StoredTaskPeer[];
    badges: StoredBadge[];
    userBadges: StoredUserBadge[];
}

export interface Metrics {
    totalCompletedTasks: number;
    totalPeersAdded: number;
    tasksWithPeersCount: number;
    tasksCompletedOnTimeCount: number;
}