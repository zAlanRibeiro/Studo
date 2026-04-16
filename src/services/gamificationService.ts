import { storage, StoredBadge, StoredUserBadge } from '../storage';
import { evaluateBadges, PREDEFINED_BADGES } from './badgeEvaluator';
import { calculateMetrics } from './metricsCalculator';

// Método que analisa mudanças
export async function processGamification(): Promise<StoredBadge[]> {
    const data = await storage.getData();
    if (!data) return [];

    let badgesUpdated = false;
    for (const badge of PREDEFINED_BADGES) {
        if (!data.badges.some(b => b.id === badge.id)) {
            data.badges.push(badge);
            badgesUpdated = true;
        }
    }
    if (badgesUpdated) {
        await storage.setData(data);
    }

    const metrics = calculateMetrics(data);
    const currentUserBadges = data.userBadges || [];
    const newBadges = evaluateBadges(metrics, currentUserBadges);

    if (newBadges.length > 0) {
        const now = new Date().toISOString();
        const newUserBadges: StoredUserBadge[] = newBadges.map(badge => ({
            badge_id: badge.id,
            earned_at: now,
        }));
        data.userBadges = [...currentUserBadges, ...newUserBadges];
        await storage.setData(data);
    }

    return newBadges;
}

export async function executeActionAndProcess(
    action: () => Promise<boolean>
): Promise<{ actionChanged: boolean; newBadges: StoredBadge[] }> {
    const actionChanged = await action();
    let newBadges: StoredBadge[] = [];
    if (actionChanged) {
        newBadges = await processGamification();
    }
    return { actionChanged, newBadges };
}