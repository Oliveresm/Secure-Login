import { useState } from "react";
import { Link } from "react-router-dom";
import MotionWrapper from "../../../ui/Pages_Transitions/MotionWrapper";
import { FcGoogle } from "react-icons/fc";
import useLogin from "./hooks/useLogin";
import useLoginOauth from "./hooks/useLoginOauth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const {
    loginWithGoogle,
    loading: oauthLoading,
    error: oauthError,
  } = useLoginOauth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email, password);
  };

  return (
    <MotionWrapper>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Glass Card */}
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm text-zinc-200 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
                placeholder="you@example.com"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-sm text-zinc-200 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
                placeholder="••••••••"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm text-left">{error}</div>
            )}

            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-zinc-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br text-white font-semibold py-2.5 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="h-px flex-1 bg-white/30" />
            <span className="px-3 text-zinc-300 text-sm">or</span>
            <span className="h-px flex-1 bg-white/30" />
          </div>

          <button
            onClick={loginWithGoogle}
            disabled={oauthLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 rounded-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

          {/* Google error */}
          {oauthError && (
            <div className="text-red-400 text-sm text-center mt-2">
              {oauthError}
            </div>
          )}

          <p className="mt-6 text-sm text-zinc-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default Login;
