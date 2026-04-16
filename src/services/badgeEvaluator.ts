import { Metrics, StoredBadge, StoredUserBadge } from '../storage';

// Definição das badges fixas (pode vir do storage ou ser hardcoded)
export const PREDEFINED_BADGES: StoredBadge[] = [
    {
        id: 'first_task',
        name: 'Primeira Tarefa',
        description: 'Concluiu sua primeira tarefa',
        icon: '🏆',
    },
    {
        id: 'dedicated_student',
        name: 'Estudante Dedicado',
        description: 'Concluiu 5 ou mais tarefas',
        icon: '📚',
    },
    {
        id: 'collaborator',
        name: 'Colaborador',
        description: 'Adicionou pelo menos um colega',
        icon: '🤝',
    },
    {
        id: 'teamwork',
        name: 'Trabalho em Equipe',
        description: 'Tem 3 tarefas diferentes com colegas',
        icon: '🫂',
    },
    {
        id: 'punctual',
        name: 'Pontual',
        description: 'Concluiu 3 tarefas dentro do prazo',
        icon: '🎯',
    },
];

// Méto que controla os badges
export function evaluateBadges(
    metrics: Metrics,
    currentUserBadges: StoredUserBadge[]
): StoredBadge[] {
    const earnedBadgeIds = new Set(currentUserBadges.map(ub => ub.badge_id));
    const newBadges: StoredBadge[] = [];

    // Regra 1: Primeira tarefa
    if (!earnedBadgeIds.has('first_task') && metrics.totalCompletedTasks >= 1) {
        const badge = PREDEFINED_BADGES.find(b => b.id === 'first_task');
        if (badge) newBadges.push(badge);
    }

    // Regra 2: Estudante dedicado (5+ tarefas)
    if (!earnedBadgeIds.has('dedicated_student') && metrics.totalCompletedTasks >= 5) {
        const badge = PREDEFINED_BADGES.find(b => b.id === 'dedicated_student');
        if (badge) newBadges.push(badge);
    }

    // Regra 3: Colaborador (pelo menos 1 colega)
    if (!earnedBadgeIds.has('collaborator') && metrics.totalPeersAdded >= 1) {
        const badge = PREDEFINED_BADGES.find(b => b.id === 'collaborator');
        if (badge) newBadges.push(badge);
    }

    // Regra 4: Trabalho em equipe (3+ tarefas com colegas)
    if (!earnedBadgeIds.has('teamwork') && metrics.tasksWithPeersCount >= 3) {
        const badge = PREDEFINED_BADGES.find(b => b.id === 'teamwork');
        if (badge) newBadges.push(badge);
    }

    // Regra 5: Pontual (3+ tarefas no prazo)
    if (!earnedBadgeIds.has('punctual') && metrics.tasksCompletedOnTimeCount >= 3) {
        const badge = PREDEFINED_BADGES.find(b => b.id === 'punctual');
        if (badge) newBadges.push(badge);
    }

    return newBadges;
}