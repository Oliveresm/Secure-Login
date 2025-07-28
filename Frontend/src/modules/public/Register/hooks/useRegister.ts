// src/hooks/auth/useRegister.ts
import { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import authApi from '@services/axios/auth.api';
import { toast } from 'sonner';

export interface RegisterDTO {
  display_name: string;
  email: string;
  password: string;
}

interface FieldErrors {
  email?: string;
  display_name?: string;
}

const useRegister = (navigate: NavigateFunction) => {
  const [loading, setLoading]       = useState(false);
  const [genericError, setGeneric]  = useState<string | null>(null);
  const [fieldErrors, setFields]    = useState<FieldErrors>({});

  const register = async (data: RegisterDTO) => {
    setLoading(true);
    setGeneric(null);
    setFields({});

    try {
      await authApi.post('/auth/register/local', data);

      toast.success(
        'Account created! Check your email to verify your account.'
      );
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      
      const { response } = err;
      const status  = response?.status;
      const payload = response?.data;

      if (status === 400 && payload?.errors) {
        const map: FieldErrors = {};
        if (payload.errors.email)        map.email        = payload.errors.email[0];
        if (payload.errors.display_name) map.display_name = payload.errors.display_name[0];
        setFields(map);
        setGeneric('Please fix the highlighted errors.');
      } else if (status === 409 && payload?.message) {
        if (payload.message.toLowerCase().includes('email')) {
          setFields({ email: payload.message });
        } else if (payload.message.toLowerCase().includes('display')) {
          setFields({ display_name: payload.message });
        } else {
          setGeneric(payload.message);
        }
      } else {
        setGeneric(payload?.message ?? 'Registration failed');
      }

      toast.error(payload?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, genericError, fieldErrors };
};

export default useRegister;

