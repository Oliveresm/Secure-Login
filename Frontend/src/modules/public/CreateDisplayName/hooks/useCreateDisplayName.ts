import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authApi from '@services/axios/secure.api';
import publicApi from '@services/axios/auth.api';

interface Params {
  displayName: string;
  token: string; // Firebase ID token
}

const useCreateDisplayName = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async ({ displayName, token }: Params) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Update display name
      await authApi.patch(`/auth/update-name/oauth?token=${token}`, {
        newName: displayName,
      });

      // 2. Login using the same Firebase token
      const loginRes = await publicApi.post('/auth/login/oauth', { idToken: token });
      const { accessToken } = loginRes.data;

      localStorage.setItem('access_token', accessToken);

      setSuccess(true);
      toast.success('Display name updated successfully!');

      // 3. Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || 'Something went wrong';

      setError(message);

      if (status === 409) {
        toast.error('That display name is already taken. Try another one.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, success, error };
};

export default useCreateDisplayName;
