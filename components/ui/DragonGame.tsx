"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GiCactus, GiCircle } from "react-icons/gi";
// Update this path to wherever ThemeProvider.tsx actually lives
import { useTheme } from "@/ui/Themecontext";

// ---- Physics (all in px / ms) ----
const GRAVITY = 0.0025;
const JUMP_VELOCITY = -0.62; // gives ~77px of max jump height

const BASE_SPEED = 0.22;
const MAX_SPEED = 0.5;
const SPEED_RAMP = 0.00002;

const SPAWN_MIN_GAP = 170;
const SPAWN_MAX_GAP = 320;

const OBSTACLE_POOL = 3;

// ---- Sizes (must match the rendered icons) ----
const PLAYER_SIZE = 22;
const OBSTACLE_WIDTH = 22;
const OBSTACLE_HEIGHT = 30;
const PLAYER_LEFT_RATIO = 0.12; // player sits at 12% from the left edge

// Small buffer so "cleared" feels fair rather than pixel-perfect
const CLEARANCE_BUFFER = 6;

type Obstacle = {
  x: number; // px, measured from left edge of the game area
  active: boolean;
  scale: number;
};

export default function Game() {
  const { active: theme } = useTheme();

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [best, setBest] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const runnerElRef = useRef<HTMLDivElement>(null);
  const obstacleElRefs = useRef<(HTMLDivElement | null)[]>([]);
  const groundElRef = useRef<HTMLDivElement>(null);
  const cloudElRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const lastRef = useRef(0);

  const makeState = (width: number) => ({
    width,
    playerX: width * PLAYER_LEFT_RATIO,
    runnerY: 0, // 0 = on the ground, negative = height above ground
    velocity: 0,
    jumping: false,
    score: 0,
    speed: BASE_SPEED,
    groundOffset: 0,
    cloudOffset: 0,
    obstacles: Array.from({ length: OBSTACLE_POOL }, () => ({
      x: width,
      active: false,
      scale: 1,
    })) as Obstacle[],
  });

  const gameRef = useRef(makeState(360));

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("dragon-game-best")
        : null;

    if (stored) {
      setBest(Number(stored));
    }
  }, []);

  // Keep game width and player x in sync with the actual rendered size
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const applyWidth = (width: number) => {
      gameRef.current.width = width;
      gameRef.current.playerX = width * PLAYER_LEFT_RATIO;
    };

    applyWidth(el.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        applyWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const paintFrame = () => {
    const g = gameRef.current;

    if (runnerElRef.current) {
      runnerElRef.current.style.left = `${g.playerX}px`;
      runnerElRef.current.style.transform = `translateY(${g.runnerY}px)`;
    }

    g.obstacles.forEach((o, i) => {
      const el = obstacleElRefs.current[i];

      if (!el) return;

      if (!o.active) {
        el.style.display = "none";
        return;
      }

      el.style.display = "block";
      el.style.left = `${o.x}px`;
      el.style.transform = `scale(${o.scale})`;
    });

    if (groundElRef.current) {
      groundElRef.current.style.backgroundPositionX = `${g.groundOffset}px`;
    }

    if (cloudElRef.current) {
      cloudElRef.current.style.transform = `translateX(${g.cloudOffset}px)`;
    }
  };

  const jump = useCallback(() => {
    const g = gameRef.current;

    if (g.jumping || gameOver) return;

    g.jumping = true;
    g.velocity = JUMP_VELOCITY;
  }, [gameOver]);

  const spawnObstacle = (
    g: ReturnType<typeof makeState>,
    fromX: number
  ) => {
    const slot = g.obstacles.find((o) => !o.active);

    if (!slot) return;

    slot.active = true;
    slot.scale = 0.9 + Math.random() * 0.25;

    slot.x =
      fromX +
      SPAWN_MIN_GAP +
      Math.random() * (SPAWN_MAX_GAP - SPAWN_MIN_GAP);
  };

  const start = useCallback(() => {
    const width = containerRef.current?.clientWidth ?? gameRef.current.width;
    const state = makeState(width);

    spawnObstacle(state, width);

    gameRef.current = state;

    setDisplayScore(0);
    setGameOver(false);
    setRunning(true);

    paintFrame();
  }, []);

  useEffect(() => {
    if (!running) return;

    lastRef.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastRef.current, 48);

      lastRef.current = now;

      const g = gameRef.current;

      g.speed = Math.min(MAX_SPEED, g.speed + SPEED_RAMP * dt);

      if (g.jumping) {
        g.velocity += GRAVITY * dt;
        g.runnerY = Math.min(g.runnerY + g.velocity * dt, 0);

        if (g.runnerY >= 0) {
          g.runnerY = 0;
          g.velocity = 0;
          g.jumping = false;
        }
      }

      let rightmost = -Infinity;
      let collided = false;

      // Height the player is currently off the ground (positive = airborne)
      const airborneHeight = -g.runnerY;

      g.obstacles.forEach((o) => {
        if (!o.active) return;

        o.x -= g.speed * dt;

        if (o.x < -OBSTACLE_WIDTH) {
          o.active = false;
          return;
        }

        rightmost = Math.max(rightmost, o.x);

        // Horizontal overlap (real px rectangles, same units as the icons)
        const xOverlap =
          o.x + OBSTACLE_WIDTH > g.playerX &&
          o.x < g.playerX + PLAYER_SIZE;

        // Vertical clearance: only a collision if the player hasn't
        // jumped above the obstacle's height yet
        const cleared = airborneHeight >= OBSTACLE_HEIGHT - CLEARANCE_BUFFER;

        if (xOverlap && !cleared) {
          collided = true;
        }
      });

      const activeCount = g.obstacles.filter((o) => o.active).length;

      if (
        activeCount < OBSTACLE_POOL &&
        (rightmost === -Infinity || rightmost < g.width - SPAWN_MIN_GAP)
      ) {
        spawnObstacle(
          g,
          rightmost === -Infinity ? g.width : rightmost
        );
      }

      g.groundOffset -= g.speed * dt * 6;
      g.cloudOffset -= g.speed * dt * 0.25;

      if (g.cloudOffset < -500) {
        g.cloudOffset = 0;
      }

      g.score += dt * 0.01;

      paintFrame();

      if (collided) {
        setRunning(false);
        setGameOver(true);

        setBest((prev) => {
          const next = Math.max(prev, Math.floor(g.score));

          if (typeof window !== "undefined") {
            localStorage.setItem("dragon-game-best", String(next));
          }

          return next;
        });

        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;

    scoreIntervalRef.current = setInterval(() => {
      setDisplayScore(Math.floor(gameRef.current.score));
    }, 100);

    return () => {
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
    };
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;

      e.preventDefault();

      if (!running) {
        start();
      } else {
        jump();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [running, jump, start]);

  const handleTap = () => {
    if (!running) {
      start();
    } else {
      jump();
    }
  };

  return (
    <button
      onClick={handleTap}
      className="w-full rounded-2xl p-3 z-10 border backdrop-blur-xl shadow-xl text-left relative overflow-hidden select-none"
      style={{
        borderColor: `${theme.accent}40`,
        background: `linear-gradient(135deg, ${theme.from}CC, ${theme.via}99, ${theme.to}66)`,
      }}
    >
      <div className="flex justify-between text-[10px] font-bold tracking-[3px] text-white/70">
        <span>NO INTERNET</span>
        <span>HI {String(best).padStart(5, "0")}</span>
      </div>

      <div
        ref={containerRef}
        className="relative h-22 my-3 overflow-hidden"
        style={{ borderBottom: `2px solid ${theme.accent}` }}
      >
        <div
          ref={cloudElRef}
          className="absolute top-2 left-0 flex text-white/50"
        >
          <div className="whitespace-nowrap">
            ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁
          </div>
          <div className="whitespace-nowrap ml-24">
            ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁ ☁
          </div>
        </div>

        <div
          ref={groundElRef}
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg,${theme.accent} 0 18px,${theme.headerBg} 18px 22px,transparent 22px 40px)`,
          }}
        />

        <div
          ref={runnerElRef}
          className="absolute bottom-1"
          style={{ left: 0 }}
        >
          <GiCircle fill={theme.accent} size={PLAYER_SIZE} />
        </div>

        {Array.from({ length: OBSTACLE_POOL }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              obstacleElRefs.current[i] = el;
            }}
            style={{ display: "none", color: theme.accent }}
            className="absolute bottom-0"
          >
            <GiCactus size={OBSTACLE_HEIGHT} />
          </div>
        ))}

        {!running && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-2xl">↑</div>
            <div className="text-[10px] font-bold tracking-[2px]">
              SPACE / TAP TO START
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            GAME OVER — TAP TO RETRY
          </div>
        )}
      </div>

      <div className="flex justify-between text-[11px] font-bold tracking-[3px] text-white">
        <span>{String(displayScore).padStart(5, "0")}</span>
        <span>BEST {String(best).padStart(5, "0")}</span>
      </div>
    </button>
  );
}