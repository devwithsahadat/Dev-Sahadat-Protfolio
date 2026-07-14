import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function InteractiveCanvas({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Glowing Cursor Trail tracking and smooth interpolation (lerping)
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;
      if (mousePos.current.x === -1000) {
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("select") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.classList.contains("cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer")
      ) {
        if (cursorRef.current) {
          cursorRef.current.classList.add("cursor-hover");
        }
      } else {
        if (cursorRef.current) {
          cursorRef.current.classList.remove("cursor-hover");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    let animationId: number;
    const updateCursor = () => {
      // Smooth interpolation for the cursor trail (lerping)
      const dx = mousePos.current.targetX - mousePos.current.x;
      const dy = mousePos.current.targetY - mousePos.current.y;
      mousePos.current.x += dx * 0.12;
      mousePos.current.y += dy * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationId = requestAnimationFrame(updateCursor);
    };

    animationId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  // Colorful Particle Mouse Trail Animation Loop
  useEffect(() => {
    const canvas = trailCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface TrailParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }

    let particles: TrailParticle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const colors = [
      "#ef4444", // Red
      "#f97316", // Orange
      "#eab308", // Yellow
      "#10b981", // Green
      "#06b6d4", // Cyan
      "#3b82f6", // Blue
      "#a855f7", // Purple
      "#ff007f", // Deep Pink/Magenta
    ];

    const lastPos = { x: -1, y: -1 };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastPos.x === -1) {
        lastPos.x = x;
        lastPos.y = y;
        return;
      }

      // Calculate distance moved
      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Interpolate along movement line to create a continuous, non-broken trail of particles
      const spacing = 5; // Spawn a particle every 5px
      const steps = Math.min(Math.floor(distance / spacing), 15);

      for (let i = 0; i <= steps; i++) {
        const t = steps > 0 ? i / steps : 1;
        const px = lastPos.x + dx * t;
        const py = lastPos.y + dy * t;

        // Spawn 1-2 particles per step for richness
        const count = Math.random() > 0.5 ? 2 : 1;
        for (let j = 0; j < count; j++) {
          particles.push({
            x: px + (Math.random() - 0.5) * 3,
            y: py + (Math.random() - 0.5) * 3,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.25, // Slight upward float
            radius: Math.random() * 3.5 + 1.5, // Small crisp sizes matching screenshot(95)
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1.0,
            decay: Math.random() * 0.02 + 0.018, // Fades out in ~50 frames
          });
        }
      }

      lastPos.x = x;
      lastPos.y = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.radius -= 0.02; // Shrink as they travel
        p.alpha -= p.decay;

        if (p.alpha > 0 && p.radius > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          
          // Outer bloom glow for modern neon touch
          ctx.shadowBlur = isDarkMode ? 6 : 4;
          ctx.shadowColor = p.color;

          ctx.fill();
          ctx.restore();
        }
      });

      // Maintain performant array size by dropping dead particles
      particles = particles.filter((p) => p.alpha > 0 && p.radius > 0);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  // Network Constellation Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const particleCount = 65;
    const connectionDistance = 120;
    const mouseConnectionDistance = 180;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off bounds
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? "rgba(168, 85, 247, 0.4)" : "rgba(168, 85, 247, 0.25)";
        ctx.fill();
      });

      // Draw lines connecting particles that are close
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDarkMode
              ? `rgba(168, 85, 247, ${alpha})`
              : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw line from particle to mouse position if mouse is close
        if (mousePos.current.targetX !== -1000) {
          // Translate screen coordinate to canvas coordinate
          const rect = canvas.getBoundingClientRect();
          const mx = mousePos.current.targetX - rect.left;
          const my = mousePos.current.targetY - rect.top;

          const dx = p1.x - mx;
          const dy = p1.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseConnectionDistance) {
            const alpha = (1 - dist / mouseConnectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = isDarkMode
              ? `rgba(139, 92, 246, ${alpha})`
              : `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Watch resize events using ResizeObserver to ensure robust size calculation
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    resizeCanvas();
    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <>
      <div id="cursor-trail" ref={cursorRef} className="glowing-cursor-trail hidden md:block" />
      <canvas id="network-canvas" ref={canvasRef} className="opacity-70 dark:opacity-90" />
      <canvas ref={trailCanvasRef} className="fixed inset-0 pointer-events-none z-[9998] hidden md:block" />
    </>
  );
}
