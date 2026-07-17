import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export function FloatingOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const generated: Orb[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 40,
      color: `rgba(239, 34, 34, ${Math.random() * 0.06 + 0.02})`,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 4,
    }));
    setOrbs(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="floating-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            animation: `float-slow ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(239,34,34,0.3), transparent 70%)",
          animation: "pulse-ring 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgba(239,34,34,0.25), transparent 70%)",
          animation: "pulse-ring 10s ease-in-out 2s infinite",
        }}
      />
    </div>
  );
}
