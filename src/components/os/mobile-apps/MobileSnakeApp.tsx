"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "right" | "down" | "left";
type GameStatus = "ready" | "running" | "paused" | "lost";
type Cell = {
  x: number;
  y: number;
};

const boardSize = 15;
const tickMs = 160;
const initialSnake: Cell[] = [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];
const initialFood: Cell = { x: 11, y: 7 };
const directionDelta: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};
const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  right: "left",
  down: "up",
  left: "right",
};

const cellKey = (cell: Cell) => `${cell.x}:${cell.y}`;
const isSameCell = (first: Cell, second: Cell) =>
  first.x === second.x && first.y === second.y;

const getDirectionBetween = (from: Cell, to: Cell): Direction | null => {
  if (to.x > from.x) return "right";
  if (to.x < from.x) return "left";
  if (to.y > from.y) return "down";
  if (to.y < from.y) return "up";

  return null;
};

const createFood = (snake: Cell[]) => {
  const occupied = new Set(snake.map(cellKey));
  const available: Cell[] = [];

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const cell = { x, y };

      if (!occupied.has(cellKey(cell))) {
        available.push(cell);
      }
    }
  }

  return available[Math.floor(Math.random() * available.length)] ?? initialFood;
};

export function MobileSnakeApp() {
  const [snake, setSnake] = useState<Cell[]>(initialSnake);
  const [food, setFood] = useState<Cell>(initialFood);
  const [direction, setDirection] = useState<Direction>("right");
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const directionRef = useRef<Direction>("right");
  const queuedDirectionRef = useRef<Direction>("right");
  const snakeRef = useRef<Cell[]>(initialSnake);
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);
  const foodRef = useRef<Cell>(initialFood);
  const pointerStartRef = useRef<Cell | null>(null);

  const snakeCellClasses = useMemo(() => {
    const classes = new Map<string, string[]>();

    snake.forEach((cell, index) => {
      const cellClasses = ["is-snake"];
      const previous = snake[index - 1];
      const next = snake[index + 1];

      if (index === 0) {
        cellClasses.push("is-head", `is-facing-${direction}`);
      } else if (index === snake.length - 1 && previous) {
        const tailDirection = getDirectionBetween(cell, previous);

        cellClasses.push("is-tail");

        if (tailDirection) {
          cellClasses.push(`is-facing-${tailDirection}`);
        }
      } else if (previous && next) {
        const previousDirection = getDirectionBetween(cell, previous);
        const nextDirection = getDirectionBetween(cell, next);

        if (
          (previousDirection === "left" && nextDirection === "right") ||
          (previousDirection === "right" && nextDirection === "left")
        ) {
          cellClasses.push("is-horizontal");
        } else if (
          (previousDirection === "up" && nextDirection === "down") ||
          (previousDirection === "down" && nextDirection === "up")
        ) {
          cellClasses.push("is-vertical");
        } else {
          cellClasses.push("is-corner");
        }
      }

      classes.set(cellKey(cell), cellClasses);
    });

    return classes;
  }, [direction, snake]);
  const foodKey = cellKey(food);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedBest = Number(window.localStorage.getItem("rafadroid.snake.best") ?? "0");

      if (Number.isFinite(storedBest)) {
        bestScoreRef.current = storedBest;
        setBestScore(storedBest);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const queueDirection = (nextDirection: Direction) => {
    if (oppositeDirection[directionRef.current] === nextDirection) return;

    queuedDirectionRef.current = nextDirection;
  };

  const resetGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setScore(0);
    setDirection("right");
    setStatus("ready");
    snakeRef.current = initialSnake;
    scoreRef.current = 0;
    directionRef.current = "right";
    queuedDirectionRef.current = "right";
    foodRef.current = initialFood;
  };

  const startGame = () => {
    if (status === "lost") {
      resetGame();
    }

    setStatus("running");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const directionByKey: Partial<Record<string, Direction>> = {
        ArrowUp: "up",
        ArrowRight: "right",
        ArrowDown: "down",
        ArrowLeft: "left",
        w: "up",
        d: "right",
        s: "down",
        a: "left",
      };
      const nextDirection = directionByKey[event.key];

      if (!nextDirection) return;

      event.preventDefault();
      queueDirection(nextDirection);
      setStatus((current) => (current === "ready" ? "running" : current));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (status !== "running") return undefined;

    const interval = window.setInterval(() => {
      const nextDirection = queuedDirectionRef.current;
      const delta = directionDelta[nextDirection];
      const currentSnake = snakeRef.current;
      const currentHead = currentSnake[0];
      const nextHead = {
        x: currentHead.x + delta.x,
        y: currentHead.y + delta.y,
      };
      const ateFood = isSameCell(nextHead, foodRef.current);
      const collisionSnake = ateFood ? currentSnake : currentSnake.slice(0, -1);
      const hasCollision =
        nextHead.x < 0 ||
        nextHead.x >= boardSize ||
        nextHead.y < 0 ||
        nextHead.y >= boardSize ||
        collisionSnake.some((cell) => isSameCell(cell, nextHead));

      directionRef.current = nextDirection;
      setDirection(nextDirection);

      if (hasCollision) {
        setStatus("lost");
        return;
      }

      const nextSnake = [nextHead, ...currentSnake];

      if (!ateFood) {
        nextSnake.pop();
      } else {
        const nextScore = scoreRef.current + 10;

        scoreRef.current = nextScore;
        setScore(nextScore);
        foodRef.current = createFood(nextSnake);
        setFood(foodRef.current);

        if (nextScore > bestScoreRef.current) {
          bestScoreRef.current = nextScore;
          setBestScore(nextScore);
          window.localStorage.setItem("rafadroid.snake.best", String(nextScore));
        }
      }

      snakeRef.current = nextSnake;
      setSnake(nextSnake);
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [status]);

  const handlePointerEnd = (clientX: number, clientY: number) => {
    const pointerStart = pointerStartRef.current;

    if (!pointerStart) return;

    const deltaX = clientX - pointerStart.x;
    const deltaY = clientY - pointerStart.y;

    pointerStartRef.current = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 22) {
      startGame();
      return;
    }

    queueDirection(
      Math.abs(deltaX) > Math.abs(deltaY)
        ? deltaX > 0
          ? "right"
          : "left"
        : deltaY > 0
          ? "down"
          : "up",
    );
    setStatus((current) => (current === "ready" || current === "paused" ? "running" : current));
  };

  return (
    <div className="mobile-app mobile-snake-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Jogo carregado</p>
        <h2>Cobrinha</h2>
      </header>

      <section className="snake-app__hud" aria-label="Placar da cobrinha">
        <div>
          <small>score</small>
          <strong>{score}</strong>
        </div>
        <div>
          <small>recorde</small>
          <strong>{bestScore}</strong>
        </div>
        <div>
          <small>estado</small>
          <strong>
            {status === "lost"
              ? "fim"
              : status === "running"
                ? "rodando"
                : status === "paused"
                  ? "pausa"
                  : "pronto"}
          </strong>
        </div>
      </section>

      <section className="snake-app__panel" aria-label="Jogo da cobrinha">
        <div
          className="snake-app__board"
          aria-label={`Tabuleiro da cobrinha. Pontuação ${score}. Direção ${direction}.`}
          role="img"
          onPointerDown={(event) => {
            pointerStartRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => handlePointerEnd(event.clientX, event.clientY)}
        >
          {Array.from({ length: boardSize * boardSize }, (_, index) => {
            const cell = {
              x: index % boardSize,
              y: Math.floor(index / boardSize),
            };
            const key = cellKey(cell);

            return (
              <span
                aria-hidden="true"
                className={cn(
                  "snake-app__cell",
                  ...(snakeCellClasses.get(key) ?? []),
                  foodKey === key && "is-food",
                )}
                key={key}
              />
            );
          })}
        </div>

        {status === "ready" || status === "lost" || status === "paused" ? (
          <div className="snake-app__overlay" aria-live="polite">
            <strong>
              {status === "lost"
                ? "game over"
                : status === "paused"
                  ? "pausado"
                  : "toque para iniciar"}
            </strong>
            <span>deslize ou use os controles</span>
          </div>
        ) : null}
      </section>

      <section className="snake-app__controls" aria-label="Controles da cobrinha">
        <button type="button" onClick={() => queueDirection("up")}>
          ↑
        </button>
        <button type="button" onClick={() => queueDirection("left")}>
          ←
        </button>
        <button
          className="snake-app__control-action"
          type="button"
          onClick={() =>
            setStatus((current) => (current === "running" ? "paused" : "running"))
          }
        >
          {status === "running" ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button type="button" onClick={() => queueDirection("right")}>
          →
        </button>
        <button type="button" onClick={() => queueDirection("down")}>
          ↓
        </button>
        <button className="snake-app__control-action" type="button" onClick={resetGame}>
          <RotateCcw size={16} />
        </button>
      </section>
    </div>
  );
}
