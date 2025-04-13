import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  type: 'glitter' | 'hearts';
  x: number;
  y: number;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ type, x, y }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const colors = type === 'glitter' 
      ? ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
      : ['#FF69B4', '#FF1493', '#FF0000', '#FF4500'];

    for (let i = 0; i < 50; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 5 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      });
    }

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.02;

        if (p.life <= 0) return;
        alive = true;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        if (type === 'hearts') {
          const size = p.size * 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + size / 4);
          ctx.bezierCurveTo(
            p.x, p.y, 
            p.x - size / 2, p.y, 
            p.x - size / 2, p.y + size / 4
          );
          ctx.bezierCurveTo(
            p.x - size / 2, p.y + size / 2, 
            p.x, p.y + size * 3/4, 
            p.x, p.y + size
          );
          ctx.bezierCurveTo(
            p.x, p.y + size * 3/4, 
            p.x + size / 2, p.y + size / 2, 
            p.x + size / 2, p.y + size / 4
          );
          ctx.bezierCurveTo(
            p.x + size / 2, p.y, 
            p.x, p.y, 
            p.x, p.y + size / 4
          );
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [type, x, y]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};