// src/modules/public/VerifyAccount/VerifyAccount.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import secureApi from '@services/axios/secure.api';
import { toast } from 'sonner';
import MotionWrapper from '@ui/Pages_Transitions/MotionWrapper';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const token = searchParams.get('token');
    if (!token) {
      toast.error('Missing verification token');
      navigate('/login');
      return;
    }

    void (async () => {
      try {
        await secureApi.get(`/auth/verify?token=${encodeURIComponent(token)}`);
        toast.success('Your account has been verified!');
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Verification failed';
        toast.error(msg);
      } finally {
        setLoading(false);
        navigate('/login');
      }
    })();
  }, [navigate, searchParams]);

  return (
    <MotionWrapper>
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>{loading ? 'Verifying your account…' : 'Redirecting…'}</p>
      </div>
    </MotionWrapper>
  );
};

export default VerifyAccount;
