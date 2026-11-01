import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { LocalDemoRepository } from './LocalDemoRepository';
export const createLocalDemoRepository = () =>
  new LocalDemoRepository(createAsyncStorage('champion-demo'));
