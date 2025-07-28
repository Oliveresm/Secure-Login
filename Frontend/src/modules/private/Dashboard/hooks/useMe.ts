// src/hooks/useMe.ts
import { useEffect, useState } from 'react';
import secureApi from '@services/axios/secure.api';

interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

const useMe = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await secureApi.get('/user/me');
        setUser(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { user, loading, error };
};

export default useMe;
