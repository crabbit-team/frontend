import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type BattleMiniGameResultType = "user_win" | "ai_win" | "draw";

export interface BattleMiniGameResult {
    result: BattleMiniGameResultType;
    userClearedCount: number;
    aiClearedCount: number;
    reward?: string;
}

interface BattleMiniGameProps {
    durationMs?: number;
    userLaneLabel?: string;
    onComplete?: (result: BattleMiniGameResult) => void;
}

type ObstacleType = "hole" | "low_obstacle" | "cactus" | "rock";

interface Obstacle {
    id: number;
    x: number;
    type: ObstacleType;
    width: number;
}

const INITIAL_SPEED = 6;
const ACCELERATION = 0.05; // Speed increase per second
const MAX_SPEED = 15;
const JUMP_DURATION = 600;
const SLIDE_DURATION = 600;
const SPAWN_INTERVAL_MIN = 1200;
const SPAWN_INTERVAL_MAX = 2500;
const SURVIVAL_TIME = 60_000;

const CHARACTER_X = 100;
const CHARACTER_WIDTH = 60;
const CHARACTER_HEIGHT = 60;
const HITBOX_PADDING = 15;
const GROUND_Y = 100;
const JUMP_HEIGHT = 150;

export function BattleMiniGame({
    durationMs = SURVIVAL_TIME,
    userLaneLabel = "You",
    onComplete,
}: BattleMiniGameProps) {
    const [obstacles, setObstacles] = useState<Obstacle[]>([
        {
            id: 0,
            x: 600, // Visible immediately
            type: "low_obstacle",
            width: 50
        }
    ]);
    const [isJumping, setIsJumping] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState(0);

    // New States
    const [isPlaying, setIsPlaying] = useState(false);
    const [startCountdown, setStartCountdown] = useState(3);
    const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED);

    const gameRunningRef = useRef(false);
    const lastSpawnRef = useRef(0);
    const nextSpawnRef = useRef(SPAWN_INTERVAL_MIN);
    const lastTimestampRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const obstacleIdRef = useRef(1);
    const isJumpingRef = useRef(false);
    const isSlidingRef = useRef(false);
    const elapsedRef = useRef(0); // Track elapsed time in ref for loop access

    // Start Countdown Effect
    useEffect(() => {
        if (startCountdown > 0) {
            const timer = setTimeout(() => {
                setStartCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (startCountdown === 0 && !isPlaying && !gameOver && !gameWon) {
            setIsPlaying(true);
            gameRunningRef.current = true;
            elapsedRef.current = 0; // Reset elapsed ref
            lastSpawnRef.current = 0;
            nextSpawnRef.current = 1000; // Start spawning sooner
        }
    }, [startCountdown, isPlaying, gameOver, gameWon]);

    // Game Loop
    useEffect(() => {
        if (!isPlaying) return;

        gameRunningRef.current = true; // Ensure flag is true when effect starts
        lastTimestampRef.current = null;

        const loop = (timestamp: number) => {
            if (!gameRunningRef.current || gameOver || gameWon) return;

            if (lastTimestampRef.current == null) {
                lastTimestampRef.current = timestamp;
                requestAnimationFrame(loop);
                return;
            }

            const delta = timestamp - lastTimestampRef.current;
            lastTimestampRef.current = timestamp;

            // Update elapsed time
            elapsedRef.current += delta;
            setElapsed(elapsedRef.current);

            if (elapsedRef.current >= durationMs) {
                gameRunningRef.current = false;
                setGameWon(true);
                setIsPlaying(false);
                return;
            }

            // Calculate current speed based on elapsed time
            // Speed increases linearly
            const newSpeed = Math.min(
                INITIAL_SPEED + (elapsedRef.current / 1000) * ACCELERATION,
                MAX_SPEED
            );
            setCurrentSpeed(newSpeed);

            // Update spawn timer
            lastSpawnRef.current += delta;

            // Spawn Logic
            let newObstacle: Obstacle | null = null;
            const containerWidth = containerRef.current?.clientWidth || window.innerWidth || 800;

            // Adjust spawn interval based on speed (faster speed = faster spawn)
            const speedMultiplier = INITIAL_SPEED / newSpeed;
            const currentSpawnMin = SPAWN_INTERVAL_MIN * speedMultiplier;
            const currentSpawnMax = SPAWN_INTERVAL_MAX * speedMultiplier;

            if (
                lastSpawnRef.current >= nextSpawnRef.current &&
                gameRunningRef.current
            ) {
                lastSpawnRef.current = 0;
                nextSpawnRef.current =
                    currentSpawnMin +
                    Math.random() * (currentSpawnMax - currentSpawnMin);

                const typeRoll = Math.random();
                let obstacleType: ObstacleType;
                let width = 50;

                if (typeRoll < 0.3) {
                    obstacleType = "hole";
                    width = 70;
                } else if (typeRoll < 0.6) {
                    obstacleType = "cactus";
                    width = 40;
                } else if (typeRoll < 0.8) {
                    obstacleType = "low_obstacle";
                    width = 50;
                } else {
                    obstacleType = "rock";
                    width = 60;
                }

                newObstacle = {
                    id: obstacleIdRef.current++,
                    x: containerWidth + 50,
                    type: obstacleType,
                    width,
                };
            }

            // Update obstacles
            setObstacles((prev) => {
                const nextObstacles: Obstacle[] = [];
                let scoreDelta = 0;

                for (const ob of prev) {
                    const newX = ob.x - newSpeed; // Use dynamic speed

                    // Remove off-screen obstacles
                    if (newX + ob.width < -100) {
                        continue;
                    }

                    // Score increment
                    if (newX + ob.width < CHARACTER_X && ob.x + ob.width >= CHARACTER_X - newSpeed) {
                        scoreDelta += 1;
                    }

                    // Collision Detection
                    const charLeft = CHARACTER_X + HITBOX_PADDING;
                    const charRight = CHARACTER_X + CHARACTER_WIDTH - HITBOX_PADDING;
                    const obLeft = newX + 5;
                    const obRight = newX + ob.width - 5;

                    const horizontalOverlap = obRight > charLeft && obLeft < charRight;

                    if (horizontalOverlap) {
                        let collided = false;

                        if (ob.type === "hole") {
                            if (!isJumpingRef.current) collided = true;
                        } else if (ob.type === "low_obstacle" || ob.type === "cactus") {
                            if (!isJumpingRef.current) collided = true;
                        } else if (ob.type === "rock") {
                            if (!isSlidingRef.current) collided = true;
                        }

                        if (collided) {
                            console.log("COLLISION!", ob.type);
                            gameRunningRef.current = false;
                            setIsPlaying(false);
                            setGameOver(true);
                            return prev;
                        }
                    }

                    nextObstacles.push({ ...ob, x: newX });
                }

                if (newObstacle) {
                    nextObstacles.push(newObstacle);
                }

                if (scoreDelta > 0) setScore(s => s + scoreDelta);

                return nextObstacles;
            });

            if (!gameOver && !gameWon) {
                requestAnimationFrame(loop);
            }
        };

        const animationId = requestAnimationFrame(loop);

        return () => {
            gameRunningRef.current = false;
            cancelAnimationFrame(animationId);
        };
    }, [isPlaying, durationMs, gameOver, gameWon]); // Removed elapsed from dependencies

    // Game Completion Handler
    useEffect(() => {
        if (!gameWon && !gameOver) return;

        const resultType: BattleMiniGameResultType = gameWon ? "user_win" : "ai_win";
        const payload: BattleMiniGameResult = {
            result: resultType,
            userClearedCount: score,
            aiClearedCount: 0,
            reward: gameWon ? "100 CRT" : undefined,
        };

        const timer = setTimeout(() => {
            onComplete?.(payload);
        }, 2500);

        return () => clearTimeout(timer);
    }, [gameWon, gameOver, score, onComplete]);

    // Controls
    const handleJump = () => {
        if (!isPlaying || isJumpingRef.current || isSlidingRef.current) return;
        isJumpingRef.current = true;
        setIsJumping(true);
        setTimeout(() => {
            isJumpingRef.current = false;
            setIsJumping(false);
        }, JUMP_DURATION);
    };

    const handleSlide = () => {
        if (!isPlaying || isJumpingRef.current || isSlidingRef.current) return;
        isSlidingRef.current = true;
        setIsSliding(true);
        setTimeout(() => {
            isSlidingRef.current = false;
            setIsSliding(false);
        }, SLIDE_DURATION);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === "Space" || e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault(); // Always prevent default for game controls
        }

        if (!isPlaying) return;

        if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
            handleJump();
        } else if (e.key === "ArrowDown") {
            handleSlide();
        }
    };

    // Global keydown handler to prevent space from scrolling
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (isPlaying && (e.code === "Space" || e.key === " ")) {
                e.preventDefault();
            }
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [isPlaying]);

    const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));

    // Retry Handler
    const handleRetry = () => {
        setObstacles([
            {
                id: 0,
                x: 600,
                type: "low_obstacle",
                width: 50
            }
        ]);
        setScore(0);
        setElapsed(0);
        setGameOver(false);
        setGameWon(false);
        setIsPlaying(false);
        setStartCountdown(3);
        setCurrentSpeed(INITIAL_SPEED);

        // Reset refs
        gameRunningRef.current = false;
        lastSpawnRef.current = 0;
        nextSpawnRef.current = SPAWN_INTERVAL_MIN;
        elapsedRef.current = 0;
        obstacleIdRef.current = 1;
        isJumpingRef.current = false;
        isSlidingRef.current = false;
    };

    return (
        <div
            ref={containerRef}
            className="w-full max-w-4xl mx-auto mt-4 rounded-xl relative overflow-hidden shadow-2xl select-none outline-none font-pixel group"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                height: "400px",
                background: "linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)",
            }}
        >
            {/* --- Background Elements --- */}

            {/* Sun */}
            <div className="absolute top-8 right-16 w-16 h-16 bg-yellow-400 rounded-full blur-sm animate-pulse opacity-80" />

            {/* Clouds (Parallax) */}
            <motion.div
                className="absolute top-12 left-0 text-white/60 text-6xl"
                animate={{ x: ["100%", "-20%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                ☁
            </motion.div>
            <motion.div
                className="absolute top-24 left-0 text-white/40 text-4xl"
                animate={{ x: ["100%", "-20%"] }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 5 }}
            >
                ☁
            </motion.div>

            {/* Mountains/Hills (Parallax) */}
            <div className="absolute bottom-[100px] left-0 right-0 h-32 opacity-60">
                <motion.div
                    className="absolute bottom-0 w-[200%] h-full flex"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-64 h-32 bg-emerald-600/30 rounded-t-full -ml-12 transform scale-y-75" />
                    ))}
                </motion.div>
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-[#5D4037] border-t-4 border-[#3E2723] z-10">
                {/* Grass Top */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-[#7CB342]" />
                {/* Moving Ground Texture */}
                <motion.div
                    className="absolute top-4 left-0 w-[200%] h-full flex opacity-30"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: isPlaying ? 2 * (INITIAL_SPEED / currentSpeed) : 0, // Speed up texture
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-8 h-2 bg-[#3E2723] rounded-full mx-12 mt-4" />
                    ))}
                </motion.div>
            </div>

            {/* --- HUD --- */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-30 font-bold text-white drop-shadow-md">
                <div className="bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    SCORE: <span className="text-yellow-400 text-xl">{score}</span>
                </div>
                {/* Time removed as requested */}
            </div>

            {/* --- Character --- */}
            <div
                className="absolute z-20"
                style={{
                    left: `${CHARACTER_X}px`,
                    bottom: `${GROUND_Y}px`,
                    width: `${CHARACTER_WIDTH}px`,
                    height: `${CHARACTER_HEIGHT}px`,
                }}
            >
                <motion.div
                    animate={{
                        y: isJumping ? -JUMP_HEIGHT : isSliding ? 20 : 0,
                        scaleY: isSliding ? 0.5 : 1,
                        rotate: isJumping ? -10 : 0,
                    }}
                    transition={{
                        type: "tween",
                        duration: isJumping ? JUMP_DURATION / 1000 : isSliding ? SLIDE_DURATION / 1000 : 0.1,
                    }}
                    className="w-full h-full relative"
                >
                    <img
                        src="/logos/Tokki.png"
                        alt="Player"
                        className="w-full h-full object-contain drop-shadow-lg"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.style.backgroundColor = '#FF9800';
                            e.currentTarget.parentElement!.style.borderRadius = '8px';
                        }}
                    />
                    {isSliding && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -10 }}
                            className="absolute -top-4 right-0 text-blue-400 text-lg font-bold"
                        >
                            💦
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* --- Obstacles --- */}
            <AnimatePresence>
                {obstacles.map((ob) => (
                    <div
                        key={ob.id}
                        className="absolute z-10 flex items-end justify-center"
                        style={{
                            left: `${ob.x}px`,
                            bottom: `${GROUND_Y}px`,
                            width: `${ob.width}px`,
                            height: ob.type === "rock" ? "140px" : "80px",
                        }}
                    >
                        {ob.type === "hole" && (
                            <div className="w-full h-4 bg-black/60 rounded-[50%] absolute -bottom-2 blur-sm scale-x-150" />
                        )}

                        {ob.type === "hole" ? (
                            <div className="w-full h-12 bg-[#3E2723] rounded-t-full border-4 border-[#5D4037] relative overflow-hidden translate-y-8">
                                <div className="absolute inset-0 bg-black/40" />
                            </div>
                        ) : ob.type === "cactus" ? (
                            <div className="w-8 h-16 bg-green-600 rounded-t-full relative border-2 border-green-800">
                                <div className="absolute top-4 -left-3 w-3 h-6 bg-green-600 rounded-l-full border-2 border-green-800 border-r-0" />
                                <div className="absolute top-8 -right-3 w-3 h-6 bg-green-600 rounded-r-full border-2 border-green-800 border-l-0" />
                            </div>
                        ) : ob.type === "rock" ? (
                            <div className="w-16 h-12 bg-gray-500 rounded-full border-2 border-gray-700 relative top-0 mb-auto">
                                <div className="absolute -left-4 top-2 w-6 h-4 bg-gray-400 rounded-full animate-pulse" />
                                <div className="absolute -right-4 top-2 w-6 h-4 bg-gray-400 rounded-full animate-pulse" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-white">🦅</div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-[#795548] rounded-sm border-2 border-[#5D4037] relative">
                                <div className="absolute top-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#5D4037_5px,#5D4037_10px)] opacity-20" />
                            </div>
                        )}
                    </div>
                ))}
            </AnimatePresence>

            {/* --- Overlays --- */}

            {/* Countdown Overlay */}
            {startCountdown > 0 && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
                    <motion.div
                        key={startCountdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    >
                        {startCountdown}
                    </motion.div>
                </div>
            )}

            {/* GO! Overlay */}
            {startCountdown === 0 && elapsed < 1000 && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-8xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    >
                        GO!
                    </motion.div>
                </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-md"
                >
                    <div className="text-center">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-5xl font-black text-red-500 mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">GAME OVER</h2>
                        <p className="text-2xl text-white mb-6">Score: {score}</p>
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                        >
                            Try Again
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Victory Overlay */}
            {gameWon && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-md"
                >
                    <div className="text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-5xl font-black text-yellow-400 mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">VICTORY!</h2>
                        <p className="text-2xl text-white mb-6">You survived!</p>
                        <div className="text-emerald-400 font-mono text-xl">Reward: 100 CRT</div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
