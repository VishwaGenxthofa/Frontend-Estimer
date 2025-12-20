import type { Client } from '../types/Index';

const KEY = 'clients';

export const saveClientsToStorage = (clients: Client[]) => {
  localStorage.setItem(KEY, JSON.stringify(clients));
};

export const getClientsFromStorage = (): Client[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const clearClientsStorage = () => {
  localStorage.removeItem(KEY);
};
