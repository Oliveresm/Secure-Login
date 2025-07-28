import { useEffect, useRef } from "react";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    /* ---------------------------------------------------
       Guard-clauses: at this point neither canvas nor ctx
       can be null, so everything below is type-safe.
    --------------------------------------------------- */
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ----------  Particle definition  ---------- */
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      private canvas: HTMLCanvasElement; // keep our own copy

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;

        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        const palette = [
          // bright-to-soft whites with a hint of pale blue
          `rgba(255,255,255,${0.4 + Math.random() * 0.4})`, // pure white, 0.4-0.8 α
          `rgba(235,240,255,${0.25 + Math.random() * 0.3})`, // soft bluish white
          `rgba(210,215,230,${0.15 + Math.random() * 0.25})`, // very light gray-blue
        ];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    /* ----------  State & helpers  ---------- */
    let animationFrameId = 0;
    let particles: Particle[] = [];

    const initParticles = () => {
      const desired = Math.min(
        Math.floor((canvas.width * canvas.height) / 10_000),
        80
      );
      particles = Array.from({ length: desired }, () => new Particle(canvas));
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const connectParticles = () => {
      const maxDistance = 150;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    /* ----------  bootstrap  ---------- */
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // sets size & spawns particles
    animate();

    /* ----------  cleanup  ---------- */
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default AnimatedBackground;