// src/modules/public/Register/Register.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useRegister from './hooks/useRegister';
import MotionWrapper from '@ui/Pages_Transitions/MotionWrapper';
import { FcGoogle } from 'react-icons/fc';
import useRegisterOauth from './hooks/useRegisterOauth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { register, loading, genericError, fieldErrors } = useRegister(navigate);
  const { registerWithGoogle, loading: oauthLoading, error: oauthError } = useRegisterOauth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ display_name: username, email, password });
  };

  return (
    <MotionWrapper>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm
                        border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
                        p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Register</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="text-left">
              <label htmlFor="username"
                     className="block text-sm text-zinc-200 mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={`w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white
                           px-4 py-2 focus:outline-none focus:ring-2
                           ${fieldErrors.display_name ? 'ring-red-500' : 'focus:ring-blue-500'}`}
                placeholder="your_username"
              />
              {fieldErrors.display_name && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.display_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="text-left">
              <label htmlFor="email"
                     className="block text-sm text-zinc-200 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white
                           px-4 py-2 focus:outline-none focus:ring-2
                           ${fieldErrors.email ? 'ring-red-500' : 'focus:ring-blue-500'}`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="text-left">
              <label htmlFor="password"
                     className="block text-sm text-zinc-200 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white
                           px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                           backdrop-blur-md"
                placeholder="••••••••"
              />
            </div>

            {genericError && <p className="text-red-400 text-sm">{genericError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                         hover:bg-gradient-to-br text-white font-semibold py-2.5 rounded-lg
                         transition-transform hover:scale-105 shadow-lg shadow-blue-500/50
                         disabled:opacity-50">
              {loading ? 'Registering…' : 'Register'}
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="h-px flex-1 bg-white/30" />
            <span className="px-3 text-zinc-300 text-sm">or</span>
            <span className="h-px flex-1 bg-white/30" />
          </div>

          <button
            type="button"
            onClick={registerWithGoogle}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3
                       bg-white/20 hover:bg-white/30 text-white font-medium py-2.5
                       rounded-lg transition-transform hover:scale-105
                       disabled:opacity-50">
            <FcGoogle size={20} />
            {oauthLoading ? 'Signing in…' : 'Sign up with Google'}
          </button>

          {oauthError && (
            <p className="mt-2 text-red-400 text-sm">{oauthError}</p>
          )}

          <p className="mt-6 text-sm text-zinc-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Register;
