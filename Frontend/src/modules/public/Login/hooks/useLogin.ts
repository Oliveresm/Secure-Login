// src/modules/public/Login/hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@services/axios/auth.api';
import { toast } from 'sonner';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.post('/auth/login/local', { email, password });

      const accessToken = res.data.accessToken;
      localStorage.setItem('access_token', accessToken); 

      toast.success('Login successful');
      navigate('/dashboard'); 
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
