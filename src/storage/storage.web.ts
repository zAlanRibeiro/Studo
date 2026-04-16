import { AppStorageData, StoredTask } from './types';

const STORAGE_KEY = '@studo:data';

export const webStorage = {
    async getData(): Promise<AppStorageData | null> {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as AppStorageData;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    },

    async setData(data: AppStorageData): Promise<void> {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    },

    async clearData(): Promise<void> {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
        }
    },

    // Métodos auxiliares para entidades específicas (opcional)
    async getTasks(): Promise<StoredTask[]> {
        const data = await this.getData();
        return data?.tasks ?? [];
    },

    async setTasks(tasks: StoredTask[]): Promise<void> {
        const data = (await this.getData()) ?? { tasks: [], peers: [], taskPeers: [], badges: [], userBadges: [] };
        data.tasks = tasks;
        await this.setData(data);
    },
};