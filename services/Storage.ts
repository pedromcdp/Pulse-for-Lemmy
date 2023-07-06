import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const get = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const set = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    Alert.alert('Error setting data to device storage', `${e}`);
  }
};

export default { get, set };
