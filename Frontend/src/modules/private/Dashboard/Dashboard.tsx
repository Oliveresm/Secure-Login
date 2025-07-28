import MotionWrapper from '@ui/Pages_Transitions/MotionWrapper';
import useMe from './hooks/useMe';

export default function Dashboard() {
  const { user, loading, error } = useMe();

  return (
    <MotionWrapper>
      <div className="z-10 relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>

          {loading && <p className="text-white/80">Loading user...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}

          {user && (
            <div className="text-white/90 space-y-2">
              <p><strong>Name:</strong> {user.display_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </MotionWrapper>
  );
}
