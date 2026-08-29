import React, { useEffect, useRef } from 'react';

export type FestivalCanvasType = 
  | 'diwali' 
  | 'ganesh' 
  | 'holi' 
  | 'janmashtami' 
  | 'independence' 
  | 'navratri' 
  | 'rakhi'
  | 'makar_sankranti'
  | 'maha_shivratri'
  | 'gudi_padwa'
  | 'goan_festivals';

interface FestiveCanvasProps {
  festivalType: FestivalCanvasType;
}

export const FestiveCanvas: React.FC<FestiveCanvasProps> = ({ festivalType }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle Base Setup
    class Particle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      color: string = '#FFD700';
      alpha: number = 1;
      rotation: number = 0;
      vRot: number = 0;
      life: number = 0;
      maxLife: number = 100;
      type: string = 'spark';

      constructor() {
        this.reset();
      }

      reset() {
        this.life = 0;
        this.maxLife = 60 + Math.random() * 80;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.05;

        if (festivalType === 'diwali') {
          this.type = 'spark';
          this.x = Math.random() * width;
          this.y = height + Math.random() * 20;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = -(1.2 + Math.random() * 1.8);
          this.size = 2 + Math.random() * 3;
          this.color = Math.random() > 0.3 ? '#FBBF24' : '#FDE68A';
          this.alpha = 0.8 + Math.random() * 0.2;
        } else if (festivalType === 'ganesh') {
          this.type = 'petal';
          this.x = Math.random() * width;
          this.y = -20 - Math.random() * 50;
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = 0.45 + Math.random() * 0.55;
          this.size = 6 + Math.random() * 6;
          this.vRot = (Math.random() - 0.5) * 0.02;
          this.maxLife = 140 + Math.random() * 80;
          const petalColors = ['#F59E0B', '#F97316', '#EAB308', '#EA580C'];
          this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
          this.alpha = 0.75 + Math.random() * 0.25;
        } else if (festivalType === 'holi') {
          this.type = 'powder';
          this.x = (width * 0.2) + Math.random() * (width * 0.6);
          this.y = (height * 0.3) + Math.random() * (height * 0.4);
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 2.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 0.5;
          this.size = 3 + Math.random() * 5;
          const holiColors = ['#EC4899', '#06B6D4', '#EAB308', '#A855F7', '#F97316', '#10B981'];
          this.color = holiColors[Math.floor(Math.random() * holiColors.length)];
          this.alpha = 0.85;
        } else if (festivalType === 'janmashtami') {
          this.type = 'butter';
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = 0.6 + Math.random() * 1.2;
          this.size = 2.5 + Math.random() * 3.5;
          this.color = Math.random() > 0.4 ? '#FFFFFF' : '#67E8F9';
          this.alpha = 0.7 + Math.random() * 0.3;
        } else if (festivalType === 'independence') {
          this.type = 'tricolor';
          this.x = Math.random() * width;
          this.y = -20 - Math.random() * 40;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = 0.5 + Math.random() * 0.65;
          this.size = 4 + Math.random() * 5;
          this.vRot = (Math.random() - 0.5) * 0.025;
          this.maxLife = 140 + Math.random() * 80;
          const triColors = ['#FF9933', '#FFFFFF', '#138808'];
          this.color = triColors[Math.floor(Math.random() * triColors.length)];
          this.alpha = 0.85;
        } else if (festivalType === 'navratri') {
          this.type = 'flare';
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 1.8;
          this.vy = (Math.random() - 0.5) * 1.8;
          this.size = 2 + Math.random() * 4;
          this.color = Math.random() > 0.5 ? '#FBBF24' : '#EF4444';
          this.alpha = 0.9;
        } else if (festivalType === 'makar_sankranti') {
          this.type = 'kite_spark';
          this.x = Math.random() * width;
          this.y = height + Math.random() * 20;
          this.vx = 0.8 + Math.random() * 1.2;
          this.vy = -(1.0 + Math.random() * 1.8);
          this.size = 3 + Math.random() * 4;
          const kiteColors = ['#F59E0B', '#EF4444', '#10B981', '#FBBF24'];
          this.color = kiteColors[Math.floor(Math.random() * kiteColors.length)];
          this.alpha = 0.85;
        } else if (festivalType === 'maha_shivratri') {
          this.type = 'sacred_glow';
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = -(0.5 + Math.random() * 0.8);
          this.size = 2.5 + Math.random() * 3.5;
          this.color = Math.random() > 0.5 ? '#E0E7FF' : '#FDE047';
          this.alpha = 0.8;
        } else if (festivalType === 'gudi_padwa') {
          this.type = 'petal';
          this.x = Math.random() * width;
          this.y = -20 - Math.random() * 50;
          this.vx = (Math.random() - 0.5) * 0.7;
          this.vy = 0.5 + Math.random() * 0.6;
          this.size = 5 + Math.random() * 5;
          this.color = Math.random() > 0.5 ? '#FBBF24' : '#84CC16';
          this.alpha = 0.85;
        } else if (festivalType === 'goan_festivals') {
          this.type = 'goan_bloom';
          this.x = Math.random() * width;
          this.y = height + Math.random() * 20;
          this.vx = (Math.random() - 0.5) * 0.9;
          this.vy = -(0.8 + Math.random() * 1.5);
          this.size = 3 + Math.random() * 4;
          const goanColors = ['#10B981', '#F59E0B', '#06B6D4', '#EC4899'];
          this.color = goanColors[Math.floor(Math.random() * goanColors.length)];
          this.alpha = 0.85;
        } else {
          // Rakhi
          this.type = 'silk';
          this.x = Math.random() * width;
          this.y = height + Math.random() * 20;
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = -(0.8 + Math.random() * 1.4);
          this.size = 2 + Math.random() * 3;
          this.color = Math.random() > 0.5 ? '#FDE047' : '#F43F5E';
          this.alpha = 0.8;
        }
      }

      update() {
        this.life++;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.vRot;

        if (this.type === 'spark' || this.type === 'silk' || this.type === 'sacred_glow' || this.type === 'kite_spark' || this.type === 'goan_bloom') {
          this.vx += (Math.random() - 0.5) * 0.05;
          this.alpha = Math.max(0, 1 - this.y / height);
        } else if (this.type === 'petal' || this.type === 'tricolor') {
          this.vx += Math.sin(this.life * 0.05) * 0.05;
        } else if (this.type === 'powder') {
          this.vx *= 0.97;
          this.vy *= 0.97;
          this.alpha = Math.max(0, 1 - this.life / this.maxLife);
        } else if (this.type === 'flare') {
          this.alpha = Math.max(0, 1 - this.life / this.maxLife);
        }

        // Out of bounds reset
        if (
          this.life >= this.maxLife ||
          this.y < -30 ||
          this.y > height + 40 ||
          this.x < -30 ||
          this.x > width + 30
        ) {
          this.reset();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.globalAlpha = this.alpha;

        if (this.type === 'petal') {
          // Oval/tear marigold petal
          c.fillStyle = this.color;
          c.beginPath();
          c.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
          c.fill();
        } else if (this.type === 'tricolor') {
          // Rectangular confetti ribbon
          c.fillStyle = this.color;
          c.fillRect(-this.size, -this.size * 0.4, this.size * 2, this.size * 0.8);
        } else if (this.type === 'powder' || this.type === 'sacred_glow' || this.type === 'goan_bloom') {
          // Soft circular powder puff / halo
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        } else if (this.type === 'butter') {
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        } else {
          // Glow spark
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(0, 0, this.size, 0, Math.PI * 2);
          c.fill();
        }

        c.restore();
      }
    }

    // Spawn high density 60fps particles
    const particleCount = width < 640 ? 32 : 55;
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [festivalType]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
