"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BALL_IMAGES = [
  "/images/balls/ball-1.png",
  "/images/balls/ball-2.png",
  "/images/balls/ball-3.png",
  "/images/balls/ball-4.png",
  "/images/balls/ball-5.png",
  "/images/balls/ball-6.png",
  "/images/balls/ball-7.png",
  "/images/balls/ball-8.png",
  "/images/balls/ball-9.png",
  "/images/balls/ball-10.png",
];

const BALL_SIZE = 130;
const HIT_ZONE = 200;
const GRAVITY = 0.45;
const FRICTION = 0.998;
const BOUNCE_DAMPENING = 0.55;
const KICK_FORCE_Y = -18;

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function JugglingGame() {
  const ballStateRef = useRef<BallState>({ x: 0, y: 0, vx: 1.5, vy: 0 });
  const angleRef = useRef(0);
  const jugglesRef = useRef(0);
  const ballImageRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isInitialized = useRef(false);

  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [ballAngle, setBallAngle] = useState(0);
  const [currentBallImage, setCurrentBallImage] = useState(0);
  const [juggles, setJuggles] = useState(0);
  const [kickIndicator, setKickIndicator] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  useEffect(() => {
    const initBall = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ballStateRef.current = {
        x: w * 0.78,
        y: h * 0.45,
        vx: 1.5,
        vy: 0,
      };
      setBallPos({ x: w * 0.78, y: h * 0.45 });
      isInitialized.current = true;
    };

    initBall();

    const loop = () => {
      const state = ballStateRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const radius = BALL_SIZE / 2;

      state.vy += GRAVITY;
      state.x += state.vx;
      state.y += state.vy;
      state.vx *= FRICTION;

      // Left wall
      if (state.x - radius < 0) {
        state.x = radius;
        state.vx = Math.abs(state.vx) * BOUNCE_DAMPENING;
      }
      // Right wall
      if (state.x + radius > w) {
        state.x = w - radius;
        state.vx = -Math.abs(state.vx) * BOUNCE_DAMPENING;
      }
      // Floor → bounce + reset counter
      if (state.y + radius > h) {
        state.y = h - radius;
        state.vy = -Math.abs(state.vy) * BOUNCE_DAMPENING;
        state.vx *= 0.9;
        if (jugglesRef.current > 0) {
          jugglesRef.current = 0;
          setJuggles(0);
          ballImageRef.current = 0;
          setCurrentBallImage(0);
        }
      }

      angleRef.current += state.vx * 1.5;
      setBallAngle(angleRef.current);
      setBallPos({ x: state.x, y: state.y });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const kick = (clientX: number, clientY: number) => {
    const state = ballStateRef.current;
    const dx = clientX - state.x;
    const dy = clientY - state.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < HIT_ZONE / 2) {
      state.vy = KICK_FORCE_Y;
      state.vx = (dx / (BALL_SIZE / 2)) * 8;

      jugglesRef.current += 1;
      setJuggles(jugglesRef.current);

      setKickIndicator({ show: true, x: state.x, y: state.y - 20 });
      setTimeout(
        () => setKickIndicator((prev) => ({ ...prev, show: false })),
        600,
      );

      if (jugglesRef.current % 10 === 0) {
        ballImageRef.current = (ballImageRef.current + 1) % BALL_IMAGES.length;
        setCurrentBallImage(ballImageRef.current);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => kick(e.clientX, e.clientY);
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    kick(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div className="fixed inset-0 pointer-events-none bg-cover bg-center bg-repeat">
      {/* Juggle count */}
      {juggles > 0 && (
        <div
          className="absolute font-obviously text-white  lg:translate-y-10 right-4 text-[14px] uppercase tracking-widest"
          style={{ top: 100, right: 24 }}
        >
          {juggles} jongle{juggles > 1 ? "s" : ""}
        </div>
      )}

      {kickIndicator.show && (
        <div
          className="absolute font-obviously text-pink text-[48px] leading-none pointer-events-none select-none"
          style={{
            left: kickIndicator.x,
            top: kickIndicator.y,
            transform: "translateX(-50%)",
            animation: "kickFloat 0.6s ease-out forwards",
          }}
        >
          +1
        </div>
      )}

      <div
        className="absolute pointer-events-auto cursor-pointer select-none"
        style={{
          left: ballPos.x - HIT_ZONE / 2,
          top: ballPos.y - HIT_ZONE / 2,
          width: HIT_ZONE,
          height: HIT_ZONE,
        }}
        onClick={handleClick}
        onTouchStart={handleTouch}
      >
        <div
          style={{
            position: "absolute",
            left: (HIT_ZONE - BALL_SIZE) / 2,
            top: (HIT_ZONE - BALL_SIZE) / 2,
            width: BALL_SIZE,
            height: BALL_SIZE,
            transform: `rotate(${ballAngle}deg)`,
          }}
        >
          <Image
            src={BALL_IMAGES[currentBallImage]}
            alt="Football"
            width={BALL_SIZE}
            height={BALL_SIZE}
            className="w-full h-full object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

    </div>
  );
}
