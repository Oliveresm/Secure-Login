import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@config/firebase';
import authApi from '@services/axios/auth.api';

const useRegisterOauth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();

  const registerWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(firebaseApp);

      const result  = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await authApi.post('/auth/register/oauth', { idToken });
      const { isNewUser } = res.data;

      if (isNewUser) {
        navigate(`/create-display-name?token=${encodeURIComponent(idToken)}`);
      } else {
        setError('This account is already registered. Please log in.');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.message;

      if (status === 409) {
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(firebaseApp);
          const result  = await signInWithPopup(auth, provider);
          const idToken = await result.user.getIdToken();

          const loginRes = await authApi.post('/auth/login/oauth', { idToken });
          const { accessToken } = loginRes.data;

          localStorage.setItem('access_token', accessToken);

          navigate('/dashboard');
        } catch (loginErr: any) {
          setError('Login failed. Please try again.');
        }
        return;
      }

      if (status === 400) {
        setError('Invalid or missing token.');
      } else if (status === 401) {
        setError('Your account is not verified yet.');
      } else if (status === 403) {
        setError('Google account does not match the registered user.');
      } else {
        setError(msg || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { registerWithGoogle, loading, error };
};

export default useRegisterOauth;
