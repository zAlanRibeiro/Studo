import { AppStorageData, StoredAtestado, StoredTask } from './types';

const STORAGE_KEY = '@studo:data';

const emptyData = (): AppStorageData => ({
    tasks: [],
    peers: [],
    taskPeers: [],
    badges: [],
    userBadges: [],
    atestados: [],
});

export const webStorage = {
    async getData(): Promise<AppStorageData | null> {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as AppStorageData;
            if (!parsed.atestados) parsed.atestados = [];
            return parsed;
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

    async getTasks(): Promise<StoredTask[]> {
        const data = await this.getData();
        return data?.tasks ?? [];
    },

    async setTasks(tasks: StoredTask[]): Promise<void> {
        const data = (await this.getData()) ?? emptyData();
        data.tasks = tasks;
        await this.setData(data);
    },

    async getAtestados(): Promise<StoredAtestado[]> {
        const data = await this.getData();
        return data?.atestados ?? [];
    },

    async setAtestados(atestados: StoredAtestado[]): Promise<void> {
        const data = (await this.getData()) ?? emptyData();
        data.atestados = atestados;
        await this.setData(data);
    },
};