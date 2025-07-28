import { useState } from 'react';
import authApi from '@services/axios/auth.api';
import { toast } from 'sonner';

interface ForgotDTO {
  email: string;
}

const useForgotPassword = () => {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const sendLink = async ({ email }: ForgotDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.post('/auth/forgot-password', { email });
      toast.success('Check your inbox for the reset link!');
      setSuccess(true);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Unable to process request';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { sendLink, loading, error, success };
};

export default useForgotPassword;
