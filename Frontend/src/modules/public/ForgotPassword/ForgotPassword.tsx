import { useState } from 'react';
import { Link } from 'react-router-dom';
import MotionWrapper from '../../../ui/Pages_Transitions/MotionWrapper';
import useForgotPassword from './hooks/useForgotPassword';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { sendLink, loading, error: apiError, success } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // client-side validation
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    void sendLink({ email });
  };

  return (
    <MotionWrapper>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="text-left">
              <label htmlFor="email" className="block text-sm text-zinc-200 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* API feedback */}
            {apiError && <p className="text-sm text-red-400">{apiError}</p>}
            {success && (
              <p className="text-sm text-green-400">
                We’ve sent you a reset link – please check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br
                         text-white font-semibold py-2.5 rounded-lg transition-transform hover:scale-105 
                         shadow-lg shadow-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-300">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default ForgotPassword;
