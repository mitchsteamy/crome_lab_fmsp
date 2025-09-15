import { useEffect, useState } from 'react';
import { StorageService } from '../services/StorageService';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await StorageService.initialize();
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('Database initialization failed:', err);
      setError('Failed to initialize database');
    }
  };

  return {
    isInitialized,
    error,
    retry: initializeDatabase
  };
}