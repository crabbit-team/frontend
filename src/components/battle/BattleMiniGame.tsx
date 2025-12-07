import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

type ObstacleType = "hole" | "low_obstacle" | "cactus" | "rock"; // Various obstacles

interface Obstacle {
    id: number;
    x: number;
    type: ObstacleType;
    width: number;
}

const GAME_SPEED = 5; // Horizontal scroll speed
const JUMP_DURATION = 500; // ms
const SLIDE_DURATION = 400; // ms
const SPAWN_INTERVAL_MIN = 1500;
const SPAWN_INTERVAL_MAX = 3000;
const SURVIVAL_TIME = 60_000; // 60 seconds

// Character position (fixed on screen, world scrolls)
const CHARACTER_X = 100; // Fixed horizontal position
const CHARACTER_WIDTH = 44; // Character width
const CHARACTER_HEIGHT = 44; // Character height
const GROUND_Y = 240; // Ground level
const JUMP_HEIGHT = 120; // Jump height in pixels

export function BattleMiniGame({
    durationMs = SURVIVAL_TIME,
    userLaneLabel = "You",
    onComplete,
}: BattleMiniGameProps) {
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [isJumping, setIsJumping] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [score, setScore] = useState(0);

    const gameRunningRef = useRef(true);
    const lastSpawnRef = useRef(0);
    const nextSpawnRef = useRef(SPAWN_INTERVAL_MIN);
    const lastTimestampRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const obstacleIdRef = useRef(1);
    const isJumpingRef = useRef(false);
    const isSlidingRef = useRef(false);

    // Handle game loop
    useEffect(() => {
        gameRunningRef.current = true;
        lastTimestampRef.current = null;
        setGameOver(false);
        setGameWon(false);
        setElapsed(0);
        setScore(0);
        setObstacles([]);

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
            setElapsed((prev) => {
                const next = prev + delta;
                if (next >= durationMs) {
                    // Win condition: survived 60 seconds
                    gameRunningRef.current = false;
                    setGameWon(true);
                }
                return next;
            });

            // Update spawn timer
            lastSpawnRef.current += delta;

            // Update obstacles
            setObstacles((prev) => {
                const nextObstacles: Obstacle[] = [];
                let scoreDelta = 0;

                // Move existing obstacles
                for (const ob of prev) {
                    const newX = ob.x - GAME_SPEED;

                    // Remove obstacles that are off-screen
                    if (newX + ob.width < 0) {
                        // Obstacle passed safely - increment score
                        if (newX + ob.width < CHARACTER_X - 20) {
                            scoreDelta += 1;
                        }
                        continue;
                    }

                    // Collision detection - simple box collision
                    const obLeft = newX;
                    const obRight = newX + ob.width;
                    const charLeft = CHARACTER_X + 5; // Small margin
                    const charRight = CHARACTER_X + CHARACTER_WIDTH - 5;

                    // Check horizontal overlap
                    const horizontalOverlap = obRight > charLeft && obLeft < charRight;

                    if (horizontalOverlap) {
                        let collided = false;

                        if (ob.type === "hole") {
                            // For holes: must be jumping to avoid
                            if (!isJumpingRef.current) {
                                collided = true;
                            }
                        } else if (ob.type === "low_obstacle") {
                            // For low obstacles: must be sliding to avoid
                            if (!isSlidingRef.current) {
                                collided = true;
                            }
                        } else if (ob.type === "cactus") {
                            // For cactus: must be jumping to avoid (tall obstacle)
                            if (!isJumpingRef.current) {
                                collided = true;
                            }
                        } else if (ob.type === "rock") {
                            // For rocks: can jump over or slide under
                            if (!isSlidingRef.current) {
                                collided = true;
                            }
                        }

                        if (collided) {
                            console.log("COLLISION!", ob.type, "isJumping:", isJumpingRef.current, "isSliding:", isSlidingRef.current);
                            gameRunningRef.current = false;
                            setGameOver(true);
                            return prev; // Stop updating
                        }
                    }

                    nextObstacles.push({ ...ob, x: newX });
                }

                // Spawn new obstacles
                const containerWidth = containerRef.current?.clientWidth || 800;
                const spawnX = containerWidth + 50;

                if (
                    lastSpawnRef.current >= nextSpawnRef.current &&
                    gameRunningRef.current
                ) {
                    lastSpawnRef.current = 0;
                    nextSpawnRef.current =
                        SPAWN_INTERVAL_MIN +
                        Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

                    // Randomly choose obstacle type with varied distribution
                    const typeRoll = Math.random();
                    let obstacleType: ObstacleType;
                    if (typeRoll < 0.25) {
                        obstacleType = "hole";
                    } else if (typeRoll < 0.5) {
                        obstacleType = "low_obstacle";
                    } else if (typeRoll < 0.75) {
                        obstacleType = "cactus";
                    } else {
                        obstacleType = "rock";
                    }
                    const width = obstacleType === "hole" ? 60 : 50;

                    nextObstacles.push({
                        id: obstacleIdRef.current++,
                        x: spawnX,
                        type: obstacleType,
                        width,
                    });
                }

                if (scoreDelta > 0) {
                    setScore((s) => s + scoreDelta);
                }

                return nextObstacles;
            });

            if (!gameOver && !gameWon) {
                requestAnimationFrame(loop);
            }
        };

        requestAnimationFrame(loop);

        return () => {
            gameRunningRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [durationMs, gameOver, gameWon]);

    // Handle game completion
    useEffect(() => {
        if (!gameWon && !gameOver) return;

        const resultType: BattleMiniGameResultType = gameWon
            ? "user_win"
            : "ai_win";

        const payload: BattleMiniGameResult = {
            result: resultType,
            userClearedCount: score,
            aiClearedCount: 0,
            reward: gameWon ? "1 Carrot" : undefined,
        };

        // Delay callback to show result screen
        setTimeout(() => {
            onComplete?.(payload);
        }, 2000);
    }, [gameWon, gameOver, score, onComplete]);

    const handleJump = () => {
        if (isJumpingRef.current || isSlidingRef.current || gameOver || gameWon)
            return;
        isJumpingRef.current = true;
        setIsJumping(true);
        setTimeout(() => {
            isJumpingRef.current = false;
            setIsJumping(false);
        }, JUMP_DURATION);
    };

    const handleSlide = () => {
        if (isJumpingRef.current || isSlidingRef.current || gameOver || gameWon)
            return;
        isSlidingRef.current = true;
        setIsSliding(true);
        setTimeout(() => {
            isSlidingRef.current = false;
            setIsSliding(false);
        }, SLIDE_DURATION);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (gameOver || gameWon) return;

        if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
            e.preventDefault();
            handleJump();
        } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
            e.preventDefault();
            handleSlide();
        }
    };

    const remainingSeconds = Math.max(
        0,
        Math.ceil((durationMs - elapsed) / 1000)
    );

    return (
        <div
            ref={containerRef}
            className="w-full max-w-4xl mx-auto mt-4 rounded-xl relative overflow-hidden shadow-2xl select-none outline-none font-pixel"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                height: "400px",
                background:
                    "linear-gradient(to bottom, hsl(var(--carrot-green)) 0%, hsl(var(--carrot-green)) 30%, hsl(var(--success)) 30%, hsl(var(--success)) 100%)",
            }}
        >
            {/* Parallax Background - Carrot Farm */}
            {/* Sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-carrot-green/20 via-success/30 to-carrot-green/40" />

            {/* Clouds */}
            <motion.div
                className="absolute top-8 left-[10%] text-white/40 text-5xl"
                animate={{ x: [0, 1000] }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                ☁
            </motion.div>
            <motion.div
                className="absolute top-16 left-[60%] text-white/30 text-4xl"
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                ☁
            </motion.div>

            {/* Distant carrots (parallax) */}
            <div className="absolute bottom-24 left-0 right-0 h-32 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={`carrot-bg-${i}`}
                        className="absolute bottom-0"
                        style={{
                            left: `${i * 200}px`,
                        }}
                        animate={{ x: [0, -1600] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <div className="text-2xl opacity-20">🥕</div>
                    </motion.div>
                ))}
            </div>

            {/* Ground */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32"
                style={{
                    background:
                        "linear-gradient(to top, hsl(var(--carrot-orange)) 0%, hsl(var(--carrot-orange)) 60%, hsl(var(--warning)) 60%, hsl(var(--warning)) 100%)",
                }}
            >
                {/* Ground texture - moving dots */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                    <motion.div
                        className="absolute inset-0 flex"
                        animate={{ x: [0, -100] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={`dot-${i}`}
                                className="w-2 h-2 bg-carrot-orange-foreground/40 rounded-full mx-12 mt-8"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* HUD */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-30 text-carrot-orange-foreground">
                <div className="flex flex-col bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-carrot-orange/30">
                    <span className="text-xs uppercase tracking-widest opacity-70">
                        Score
                    </span>
                    <span className="text-2xl">{score.toString().padStart(3, "0")}</span>
                </div>

                <div className="flex flex-col items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-carrot-orange/30">
                    <span className="text-xs uppercase tracking-widest opacity-70">
                        Time
                    </span>
                    <span className="text-xl">{remainingSeconds}s</span>
                </div>

                <div className="flex flex-col items-end bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-carrot-orange/30">
                    <span className="text-xs uppercase tracking-widest opacity-70">
                        {userLaneLabel}
                    </span>
                    <span className="text-2xl">🏃</span>
                </div>
            </div>

            {/* Tokki Character */}
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
                        y: isJumping ? -JUMP_HEIGHT : isSliding ? 15 : 0,
                        scaleY: isSliding ? 0.6 : 1,
                        rotate: isJumping ? [0, -5, 0] : 0,
                    }}
                    transition={{
                        duration: isJumping
                            ? JUMP_DURATION / 1000
                            : isSliding
                            ? SLIDE_DURATION / 1000
                            : 0.1,
                        ease: isJumping ? "easeOut" : "easeInOut",
                    }}
                    className="relative w-full h-full"
                >
                    {/* Tokki Image */}
                    <img
                        src="/logos/Tokki.png"
                        alt="Tokki"
                        className="w-full h-full object-contain"
                        style={{
                            filter: isSliding ? "brightness(0.8)" : "brightness(1)",
                            imageRendering: "crisp-edges",
                        }}
                    />
                </motion.div>
            </div>

            {/* Obstacles */}
            {obstacles.map((ob) => (
                <div
                    key={ob.id}
                    className="absolute z-10"
                    style={{
                        left: `${ob.x}px`,
                        bottom: `${GROUND_Y}px`,
                        width: `${ob.width}px`,
                    }}
                >
                    {ob.type === "hole" ? (
                        // Rabbit Hole
                        <div
                            className="absolute bottom-0 w-full"
                            style={{
                                height: "80px",
                                background:
                                    "radial-gradient(ellipse 60% 100% at 50% 100%, hsl(var(--carrot-orange-foreground)) 0%, transparent 70%)",
                            }}
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-carrot-orange-foreground/40 rounded-t-full" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-12 bg-carrot-orange-foreground/60 rounded-t-full" />
                        </div>
                    ) : ob.type === "low_obstacle" ? (
                        // Low Obstacle (carrot stump)
                        <div className="absolute bottom-0 w-full flex items-end justify-center">
                            <div className="w-8 h-12 bg-warning rounded-t-lg border-2 border-warning-foreground/30" />
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-warning-foreground/20 rounded-full" />
                        </div>
                    ) : ob.type === "cactus" ? (
                        // Cactus (jump to avoid)
                        <div className="absolute bottom-0 w-full flex items-end justify-center">
                            <div className="relative w-10 h-16">
                                {/* Main body */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-14 bg-success rounded-lg" />
                                {/* Left arm */}
                                <div className="absolute bottom-6 left-0 w-4 h-6 bg-success rounded-l-lg" />
                                {/* Right arm */}
                                <div className="absolute bottom-8 right-0 w-4 h-6 bg-success rounded-r-lg" />
                                {/* Spikes */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-success-foreground/40 rounded-full" />
                                <div className="absolute top-6 left-3 w-2 h-2 bg-success-foreground/40 rounded-full" />
                                <div className="absolute top-10 right-3 w-2 h-2 bg-success-foreground/40 rounded-full" />
                            </div>
                        </div>
                    ) : (
                        // Rock (slide to avoid)
                        <div className="absolute bottom-0 w-full flex items-end justify-center">
                            <div className="relative w-12 h-10">
                                {/* Main rock */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 bg-muted rounded-[40%] border-2 border-muted-foreground/30" />
                                {/* Highlight */}
                                <div className="absolute top-1 left-6 w-3 h-2 bg-white/20 rounded-full" />
                                {/* Shadow */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-carrot-orange-foreground/20 rounded-full blur-sm" />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Instructions */}
            {elapsed < 3000 && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card/90 backdrop-blur-sm text-carrot-orange-foreground px-6 py-4 rounded-lg border-2 border-carrot-orange shadow-lg"
                    >
                        <div className="text-sm mb-2">↑ SPACE: JUMP</div>
                        <div className="text-sm">↓ DOWN: SLIDE</div>
                        <div className="text-xs mt-2 opacity-70">
                            Survive 60 seconds!
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-50 bg-background/90 backdrop-blur-sm"
                >
                    <div className="bg-card border-2 border-error p-8 rounded-2xl shadow-2xl text-center">
                        <div className="text-6xl mb-4">💥</div>
                        <h2 className="text-3xl font-bold text-error mb-2">
                            GAME OVER
                        </h2>
                        <div className="text-carrot-orange-foreground font-mono mb-4">
                            Score: {score}
                        </div>
                        <div className="text-xs text-muted-foreground animate-pulse">
                            Redirecting...
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Victory Screen */}
            {gameWon && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center z-50 bg-background/90 backdrop-blur-sm"
                >
                    <div className="bg-card border-2 border-success p-8 rounded-2xl shadow-2xl text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold text-success mb-2">
                            VICTORY!
                        </h2>
                        <div className="text-carrot-orange-foreground font-mono mb-4">
                            Score: {score}
                        </div>
                        <div className="text-sm text-success mb-2">
                            Tokki survived 60 seconds!
                        </div>
                        <div className="text-xs text-muted-foreground animate-pulse">
                            You win the AI battle!
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
