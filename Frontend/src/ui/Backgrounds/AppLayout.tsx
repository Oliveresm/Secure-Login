const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="fixed inset-0 -z-20 bg-gradient-to-t from-[#0d111a] via-[#151c29] to-[#1a2231]" />
      {children}
    </div>
  );
};

export default AppLayout;
