import { useEffect, useRef } from "react";
import "./Starfield.css";

const STAR_COUNT = 220;
const SHOOTING_STAR_INTERVAL = 6000;

function randomStar(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.3 + 0.5,
    baseAlpha: Math.random() * 0.45 + 0.45,
    twinkleSpeed: Math.random() * 0.0015 + 0.0004,
    twinklePhase: Math.random() * Math.PI * 2,
    driftSpeed: Math.random() * 0.008 + 0.002,
  };
}

function randomShootingStar(width, height) {
  const startX = Math.random() * width * 0.6 + width * 0.2;
  return {
    x: startX,
    y: -20,
    vx: -1.6 - Math.random() * 1.4,
    vy: 2.4 + Math.random() * 1.6,
    life: 0,
    maxLife: 55 + Math.random() * 20,
  };
}

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let shootingStars = [];
    let rafId;
    let lastShootingStarAt = performance.now();

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: STAR_COUNT }, () => randomStar(width, height));
    }

    function tick(now) {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.y += star.driftSpeed;
        if (star.y > height) star.y = 0;
        const twinkle = Math.sin(now * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.baseAlpha + twinkle * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 234, 228, ${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      }

      if (now - lastShootingStarAt > SHOOTING_STAR_INTERVAL && Math.random() < 0.5) {
        shootingStars.push(randomShootingStar(width, height));
        lastShootingStarAt = now;
      }

      shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
      for (const s of shootingStars) {
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        const fade = 1 - s.life / s.maxLife;
        const tailX = s.x - s.vx * 6;
        const tailY = s.y - s.vy * 6;
        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(217, 184, 114, ${fade})`);
        gradient.addColorStop(1, "rgba(217, 184, 114, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
