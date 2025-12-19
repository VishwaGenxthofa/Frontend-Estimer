// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to persist state in localStorage
 * @param key - The key to store the value under in localStorage
 * @param initialValue - The initial value (used if nothing is in localStorage)
 * @returns [storedValue, setValue] - Similar to useState
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrap setValue to also update localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function like useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Optional: Sync across tabs (listen to storage events)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing updated localStorage value for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;