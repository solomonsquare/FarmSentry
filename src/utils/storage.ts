import { FarmData } from '../types';

const STORAGE_KEY = 'farm-management-data';

export const saveData = (data: FarmData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadData = (): FarmData | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};