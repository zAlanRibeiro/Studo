import { Platform } from 'react-native';
import { nativeStorage } from './storage.native';
import { webStorage } from './storage.web';

export const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

export * from './types';
