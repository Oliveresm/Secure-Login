// src/modules/public/ResetPassword/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MotionWrapper from '@ui/Pages_Transitions/MotionWrapper';
import useResetPassword from './hooks/useResetPassword';
import { toast } from 'sonner';

// ───────────────────────────────────────────────────────────────────────────────
// Same rules you use on the backend (see reset-password.schema.ts)
// ───────────────────────────────────────────────────────────────────────────────
const passwordRules = [
  { test: (s: string) => s.length >= 6,          msg: 'Must be at least 6 characters' },
  { test: (s: string) => /[A-Z]/.test(s),        msg: 'Must include an uppercase letter' },
  { test: (s: string) => /[a-z]/.test(s),        msg: 'Must include a lowercase letter' },
  { test: (s: string) => /[0-9]/.test(s),        msg: 'Must include a number' },
  { test: (s: string) => /[^A-Za-z0-9]/.test(s), msg: 'Must include a symbol' },
  { test: (s: string) => !/[<>]/.test(s),        msg: 'Password contains invalid characters' },
];
// ───────────────────────────────────────────────────────────────────────────────

const ResetPassword = () => {
  // read ?token=... from the URL
  const [params]   = useSearchParams();
  const urlToken   = params.get('token') ?? '';

  // form state
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { reset, loading, error: apiError, success } = useResetPassword();

  // notify immediately if token is missing
  useEffect(() => {
    if (!urlToken) toast.error('Missing recovery token in the URL.');
  }, [urlToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlToken) return; // guard

    // client validations
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    // run through rule set
    for (const rule of passwordRules) {
      if (!rule.test(password)) {
        toast.error(rule.msg);
        return;
      }
    }

    // call backend
    void reset({ token: urlToken, new_password: password });
  };

  return (
    <MotionWrapper>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Reset Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <div className="text-left">
              <label htmlFor="password" className="block text-sm text-zinc-200 mb-1">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              />
            </div>

            {/* Confirm password */}
            <div className="text-left">
              <label htmlFor="confirm" className="block text-sm text-zinc-200 mb-1">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              />
            </div>

            {/* API feedback */}
            {apiError && <p className="text-sm text-red-400">{apiError}</p>}
            {success && (
              <p className="text-sm text-green-400">
                Password updated – you can&nbsp;
                <Link to="/login" className="underline text-blue-400">
                  log in
                </Link>
                .
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br
                         text-white font-semibold py-2.5 rounded-lg transition-transform hover:scale-105
                         shadow-lg shadow-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default ResetPassword;
