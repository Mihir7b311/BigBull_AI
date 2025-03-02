// src/components/WavyBackground/WavyBackground.jsx
import React, { useEffect, useRef } from "react";
import './WavyBackground.css';

// Simplified version of simplex-noise for React without TypeScript
const createNoise3D = () => {
  // This is a very simplified version
  // In a real app, you would use the actual simplex-noise library
  return (x, y, z) => {
    return Math.sin(x * 0.3 + z) * Math.cos(y * 0.2 + z) * 0.5;
  };
};

const WavyBackground = ({
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5
}) => {
  const noise = createNoise3D();
  let w, h, nt, i, x, ctx, canvas;
  const canvasRef = useRef(null);
  
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#2563eb",
    "#4f46e5",
    "#7c3aed",
    "#9333ea",
    "#0284c7",
  ];
  
  const drawWave = (n) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId;
  const render = () => {
    if (!ctx) return;
    ctx.fillStyle = backgroundFill || "#000000";
    ctx.globalAlpha = waveOpacity || 0.3;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      className="wavy-canvas"
      ref={canvasRef}
      id="canvas"
    />
  );
};

export default WavyBackground;