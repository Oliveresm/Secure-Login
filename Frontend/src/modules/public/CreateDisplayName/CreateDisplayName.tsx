import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import MotionWrapper from '../../../ui/Pages_Transitions/MotionWrapper';
import useCreateDisplayName from './hooks/useCreateDisplayName';

const CreateDisplayName = () => {
  const [displayName, setDisplayName] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { submit, loading, error, success } = useCreateDisplayName();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error('Please enter your display name.');
      return;
    }

    void submit({ displayName, token });
  };

  return (
    <MotionWrapper>
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Create Display Name</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="name" className="block text-sm text-zinc-200 mb-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg bg-white/20 placeholder-zinc-400 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
                placeholder="e.g. JohnDoe"
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-green-400">Display name updated successfully!</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br
                         text-white font-semibold py-2.5 rounded-lg transition-transform hover:scale-105 
                         shadow-lg shadow-blue-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </MotionWrapper>
  );
};

export default CreateDisplayName;
