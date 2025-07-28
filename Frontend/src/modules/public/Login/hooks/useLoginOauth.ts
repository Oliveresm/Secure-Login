import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@config/firebase';
import authApi from '@services/axios/auth.api';
import { toast } from 'sonner';

const useLoginOauth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(firebaseApp);

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();


      try {
        const loginRes = await authApi.post('/auth/login/oauth', { idToken });
        const { accessToken } = loginRes.data;

        localStorage.setItem('access_token', accessToken);
        toast.success('Logged in successfully');
        navigate('/dashboard');
        return;
      } catch (loginErr: any) {
        const loginStatus = loginErr?.response?.status;

        if (loginStatus === 404) {
          try {
            const registerRes = await authApi.post('/auth/register/oauth', { idToken });
            const { isNewUser } = registerRes.data;

            if (isNewUser) {
              toast.success('Account created! Let’s finish setting up.');
              navigate(`/create-display-name?token=${encodeURIComponent(idToken)}`);
              return;
            }

            toast.error('This account is already registered. Please log in.');
          } catch (registerErr: any) {
            const registerMsg = registerErr?.response?.data?.message || 'Registration failed.';
            toast.error(registerMsg);
          }
        } else {
          const loginMsg = loginErr?.response?.data?.message || 'Login failed.';
          toast.error(loginMsg);
        }
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 400) {
        setError('Invalid or missing token.');
      } else if (status === 403) {
        setError('Google account does not match the registered user.');
      } else {
        setError(msg || 'Google sign-in failed. Please try again.');
      }

      toast.error(error || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};

export default useLoginOauth;
