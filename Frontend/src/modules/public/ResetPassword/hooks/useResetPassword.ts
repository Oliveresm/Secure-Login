// src/modules/public/ResetPassword/hooks/useResetPassword.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '@services/axios/auth.api';
import { toast } from 'sonner';

interface ResetDTO {
  token: string;
  new_password: string;
}

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  const reset = async ({ token, new_password }: ResetDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.post('/auth/reset-password', { token, new_password });

      toast.success('Password updated, you can now log in!');
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 500); 

    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Unable to reset password';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { reset, loading, error, success };
};

export default useResetPassword;
