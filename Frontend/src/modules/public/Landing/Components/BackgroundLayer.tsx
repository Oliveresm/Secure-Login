import AnimatedBackground from "@ui/Backgrounds/AnimatedBackground";

const BackgroundLayer = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Degradado oscuro con hex + animación encima */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#0f172a,#1e293b,#020617)]"
      />
      <AnimatedBackground />
    </div>
  );
};

export default BackgroundLayer;
