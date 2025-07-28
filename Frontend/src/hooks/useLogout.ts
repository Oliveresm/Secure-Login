import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import secureApi from '@services/axios/secure.api';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // 1) Notify backend to invalidate refresh token
      await secureApi.post('/auth/logout');
    } catch {
      // Silent fail (e.g. token already expired)
    } finally {
      // 2) Clear local access token and redirect
      localStorage.removeItem('access_token');
      toast.info('Session expired, please log in again');
      navigate('/login');
    }
  };

  return logout;
};

export default useLogout;
