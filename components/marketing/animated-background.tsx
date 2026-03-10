"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement("div");
      star.className =
        "absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.opacity = String(Math.random() * 0.6 + 0.2);
      starsRef.current.appendChild(star);
    }
  }, []);

  return (
    <>
      <div
        ref={starsRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
      />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--green-primary) 0%, transparent 70%)",
            top: "-200px",
            right: "-100px",
            animation: "blob 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--tan-light) 0%, transparent 70%)",
            bottom: "-150px",
            left: "-100px",
            animation: "blob 20s ease-in-out infinite",
            animationDelay: "-7s",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--green-light) 0%, transparent 70%)",
            top: "50%",
            right: "10%",
            animation: "blob 20s ease-in-out infinite",
            animationDelay: "-14s",
          }}
        />
      </div>
    </>
  );
}
