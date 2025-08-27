import { useState, useEffect } from 'react';
import { User } from '../types';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('eventApp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const userData: User = {
        id: '1',
        username,
        role: 'admin'
      };
      setUser(userData);
      localStorage.setItem('eventApp_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventApp_user');
  };

  return { user, login, logout, loading };
};