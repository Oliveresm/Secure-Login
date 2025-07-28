// src/ui/Backgrounds/PrivateLayout.tsx
import AnimatedBackground from "./AnimatedBackground";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Fondo degradado de respaldo */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-t from-[#0d111a] via-[#151c29] to-[#1a2231]" />
      {/* Fondo animado con partículas */}
      <AnimatedBackground />
      {children}
    </div>
  );
};

export default PrivateLayout;
