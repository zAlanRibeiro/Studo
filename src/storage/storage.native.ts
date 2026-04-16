import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStorageData, StoredTask } from './types';

const STORAGE_KEY = '@studo:data';

export const nativeStorage = {
    async getData(): Promise<AppStorageData | null> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as AppStorageData;
        } catch (error) {
            console.error('Erro ao ler do AsyncStorage:', error);
            return null;
        }
    },

    async setData(data: AppStorageData): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Erro ao salvar no AsyncStorage:', error);
        }
    },

    async clearData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Erro ao limpar AsyncStorage:', error);
        }
    },

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