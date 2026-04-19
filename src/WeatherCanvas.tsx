import { useEffect, useRef } from 'react';

export type WeatherType = 'sakura' | 'rain' | 'none';

export const WeatherCanvas = ({ type }: { type: WeatherType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: any[] = [];
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      // Handle high DPI displays for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    const count = type === 'sakura' ? 15 : 150;
    for(let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: type === 'sakura' ? Math.random() * 4 + 4 : Math.random() * 1.5 + 0.5,
            speedY: type === 'sakura' ? Math.random() * 1.2 + 0.5 : Math.random() * 15 + 10,
            speedX: type === 'sakura' ? Math.random() * 1.5 - 0.75 : Math.random() * 1 - 0.5,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.5 + 0.5,
            color: type === 'rain' ? `rgba(200, 220, 255, ${Math.random() * 0.4 + 0.2})` : ''
        });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (type === 'sakura') {
           p.angle += p.spin;
           // Add a subtle sine wave sway to petals
           p.x += Math.sin(p.y * 0.01) * 0.4; 
        }

        // Wrap around screen
        if (p.y > h + p.size * 2) {
          p.y = -p.size * 2;
          p.x = Math.random() * w;
        }
        if (p.x > w + p.size * 2) p.x = -p.size * 2;
        if (p.x < -p.size * 2) p.x = w + p.size * 2;

        ctx.save();
        ctx.translate(p.x, p.y);
        
        if (type === 'sakura') {
          ctx.rotate(p.angle);
          
          // Realistic Teardrop / Sakura Petal Shape based on reference
          // Creates a gradient from white-pink at top to deep pink at tip
          const gradient = ctx.createLinearGradient(0, -p.size, 0, p.size);
          gradient.addColorStop(0, `rgba(255, 235, 240, ${p.opacity})`);
          gradient.addColorStop(0.5, `rgba(255, 180, 200, ${p.opacity})`);
          gradient.addColorStop(1, `rgba(255, 110, 150, ${p.opacity})`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          
          // Custom bezier path for reference image (pointed base, wider curved top)
          ctx.moveTo(0, p.size); // bottom point
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.2, -p.size * 0.8, -p.size * 0.8, 0, -p.size); // left curve
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.8, p.size * 0.2, 0, p.size); // right curve
          
          ctx.fill();
        } else if (type === 'rain') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p.speedX, p.speedY * 1.5);
          ctx.stroke();
        }
        ctx.restore();
      });
      animationId = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
