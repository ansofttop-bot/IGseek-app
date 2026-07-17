import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  type: "dot" | "ring" | "line";
  angle: number;
  spin: number;
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const COUNT = 120;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function createParticle(): Particle {
      const w = canvas!.width;
      const h = canvas!.height;
      const typeRand = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.4 + 0.05,
        hue: Math.random() * 20 + 345,
        life: 0,
        maxLife: Math.random() * 600 + 200,
        type: typeRand < 0.7 ? "dot" : typeRand < 0.9 ? "ring" : "line",
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
      };
    }

    function init() {
      particlesRef.current = Array.from({ length: COUNT }, createParticle);
    }

    function drawParticle(p: Particle) {
      const c = ctx!;
      const lifeRatio = p.life / p.maxLife;
      const fadeIn = Math.min(lifeRatio * 5, 1);
      const fadeOut = Math.max(1 - (lifeRatio - 0.8) * 5, 0);
      const alpha = p.opacity * fadeIn * (lifeRatio > 0.8 ? fadeOut : 1);

      if (alpha <= 0) return;

      c.save();
      c.globalAlpha = alpha;

      if (p.type === "dot") {
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fillStyle = `hsla(${p.hue}, 85%, 55%, 1)`;
        c.fill();
        if (p.size > 1.2) {
          c.beginPath();
          c.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          c.fillStyle = `hsla(${p.hue}, 85%, 55%, 0.08)`;
          c.fill();
        }
      } else if (p.type === "ring") {
        c.beginPath();
        c.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        c.strokeStyle = `hsla(${p.hue}, 85%, 55%, 1)`;
        c.lineWidth = 0.5;
        c.stroke();
      } else {
        c.translate(p.x, p.y);
        c.rotate(p.angle);
        c.beginPath();
        c.moveTo(-p.size * 3, 0);
        c.lineTo(p.size * 3, 0);
        c.strokeStyle = `hsla(${p.hue}, 85%, 55%, 1)`;
        c.lineWidth = 0.6;
        c.stroke();
      }

      c.restore();
    }

    function animate() {
      const c = ctx!;
      const cvs = canvas!;
      c.clearRect(0, 0, cvs.width, cvs.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        p.angle += p.spin;

        if (p.life >= p.maxLife) {
          particlesRef.current[i] = createParticle();
          continue;
        }

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.0008;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.vx *= 0.995;
        p.vy *= 0.995;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = cvs.width + 10;
        if (p.x > cvs.width + 10) p.x = -10;
        if (p.y < -10) p.y = cvs.height + 10;
        if (p.y > cvs.height + 10) p.y = -10;

        drawParticle(p);
      }

      animId = requestAnimationFrame(animate);
    }

    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    resize();
    init();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
