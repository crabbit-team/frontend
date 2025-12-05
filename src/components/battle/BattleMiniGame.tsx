import { useEffect, useRef, useState } from "react";

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
    aiLaneLabel?: string;
    onComplete?: (result: BattleMiniGameResult) => void;
}

interface Obstacle {
    id: number;
    lane: "user" | "ai";
    x: number;
    type: "cactus_small" | "cactus_large" | "bird"; // Dino style types
    hasPassedUser?: boolean;
    hasPassedAI?: boolean;
    hitUser?: boolean;
    hitAI?: boolean;
}

const OBSTACLE_SPEED = 8; // Faster, snappier feel
const JUMP_DURATION = 600; // ms
const STUN_DURATION = 800; // ms
const SPAWN_INTERVAL_MIN = 1000;
const SPAWN_INTERVAL_MAX = 2200;

export function BattleMiniGame({
    durationMs = 60_000,
    userLaneLabel = "You",
    aiLaneLabel = "AI",
    onComplete,
}: BattleMiniGameProps) {
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [userJumping, setUserJumping] = useState(false);
    const [aiJumping, setAiJumping] = useState(false);
    const [userStunned, setUserStunned] = useState(false);
    const [userCleared, setUserCleared] = useState(0);
    const [aiCleared, setAiCleared] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [finished, setFinished] = useState(false);

    const gameRunningRef = useRef(true);
    const userStunnedRef = useRef(false);

    // Unified spawn timer
    const lastSpawnRef = useRef(0);
    const nextSpawnRef = useRef(SPAWN_INTERVAL_MIN);

    const lastTimestampRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const obstacleIdRef = useRef(1);

    const obstaclesRef = useRef<Obstacle[]>([]);

    // Handle game loop
    useEffect(() => {
        gameRunningRef.current = true;
        lastTimestampRef.current = null;

        const loop = (timestamp: number) => {
            if (!gameRunningRef.current) return;

            if (lastTimestampRef.current == null) {
                lastTimestampRef.current = timestamp;
                requestAnimationFrame(loop);
                return;
            }

            const delta = timestamp - lastTimestampRef.current;
            lastTimestampRef.current = timestamp;

            setElapsed((prev) => {
                const next = prev + delta;
                if (next >= durationMs) {
                    gameRunningRef.current = false;
                    setFinished(true);
                }
                return next;
            });

            // Update spawn timer
            lastSpawnRef.current += delta;

            setObstacles((prev) => {
                const nextObstacles: Obstacle[] = [];
                let userClearedDelta = 0;
                let aiClearedDelta = 0;

                // Fixed Character Position (Dino style)
                // Let's say character is at 15% of the container width
                const containerWidth = containerRef.current?.clientWidth || 800;
                const characterX = containerWidth * 0.15;

                // 1. Move & Process existing obstacles
                for (const ob of prev) {
                    const newX = ob.x - OBSTACLE_SPEED;

                    // Skip obstacles that are far off-screen
                    if (newX < -100) continue;

                    const updated: Obstacle = { ...ob, x: newX };

                    // --- Collision Detection ---
                    // Hitbox: Character is roughly 40px wide. 
                    // Let's assume character is at [characterX, characterX + 40]
                    const charStart = characterX;
                    const charEnd = characterX + 40;
                    const obsStart = newX;
                    const obsEnd = newX + 40; // Approx obstacle width

                    // User Collision
                    if (
                        updated.lane === "user" &&
                        !updated.hitUser &&
                        !userStunnedRef.current &&
                        !userJumping && // Simple check: if jumping, immune to ground obstacles (improve for birds later)
                        obsStart < charEnd - 10 && // Allow some overlap (generous hitbox)
                        obsEnd > charStart + 10
                    ) {
                        updated.hitUser = true;
                        triggerUserStun();
                    }

                    // AI Collision
                    if (
                        updated.lane === "ai" &&
                        !updated.hitAI &&
                        !aiJumping &&
                        obsStart < charEnd - 10 &&
                        obsEnd > charStart + 10
                    ) {
                        updated.hitAI = true;
                    }

                    // --- Scoring ---
                    // Count cleared obstacles (when they pass behind the character)
                    if (
                        updated.lane === "user" &&
                        !updated.hasPassedUser &&
                        obsEnd < charStart
                    ) {
                        updated.hasPassedUser = true;
                        if (!updated.hitUser) {
                            userClearedDelta += 1;
                        }
                    }

                    if (
                        updated.lane === "ai" &&
                        !updated.hasPassedAI &&
                        obsEnd < charStart
                    ) {
                        updated.hasPassedAI = true;
                        if (!updated.hitAI) {
                            aiClearedDelta += 1;
                        }
                    }

                    nextObstacles.push(updated);
                }

                // 2. Spawn new obstacles (Synced)
                const spawnX = containerWidth + 50; // Start just off-screen

                if (
                    lastSpawnRef.current >= nextSpawnRef.current &&
                    gameRunningRef.current
                ) {
                    lastSpawnRef.current = 0;
                    nextSpawnRef.current =
                        SPAWN_INTERVAL_MIN +
                        Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

                    // Spawn for BOTH lanes at the same time
                    const id1 = obstacleIdRef.current++;
                    const id2 = obstacleIdRef.current++;
                    const typeRoll = Math.random();
                    const obsType: Obstacle["type"] = typeRoll > 0.7 ? "bird" : typeRoll > 0.4 ? "cactus_large" : "cactus_small";

                    nextObstacles.push({
                        id: id1,
                        lane: "user",
                        x: spawnX,
                        type: obsType,
                    });
                    nextObstacles.push({
                        id: id2,
                        lane: "ai",
                        x: spawnX,
                        type: obsType,
                    });
                }

                if (userClearedDelta > 0) setUserCleared((c) => c + userClearedDelta);
                if (aiClearedDelta > 0) setAiCleared((c) => c + aiClearedDelta);

                // Update ref for AI logic
                obstaclesRef.current = nextObstacles;

                return nextObstacles;
            });

            // AI Logic
            setAiJumping((isJumping) => {
                if (isJumping || !gameRunningRef.current) return isJumping;

                const containerWidth = containerRef.current?.clientWidth || 800;
                const characterX = containerWidth * 0.15;

                // Look ahead
                const detectionRange = 180; // Pixels to look ahead
                const ahead = obstaclesRef.current.find(
                    (o) =>
                        o.lane === "ai" &&
                        o.x > characterX &&
                        o.x < characterX + detectionRange &&
                        !o.hitAI
                );

                if (ahead) {
                    // Randomize reaction slightly
                    // 10% chance to jump "too early" or "too late" (fail)
                    // 90% chance to jump correctly
                    // We simulate this by just checking a random value every frame an obstacle is in range
                    // But we need to be careful not to spam jump.

                    // Simple logic: if in "danger zone" (closer), higher chance to jump.
                    const distance = ahead.x - characterX;
                    const jumpProbability = distance < 100 ? 0.3 : 0.05; // Increase prob as it gets closer

                    if (Math.random() < jumpProbability) {
                        triggerAIJump();
                        return true;
                    }
                }

                return isJumping;
            });

            if (!finished) {
                requestAnimationFrame(loop);
            }
        };

        requestAnimationFrame(loop);

        return () => {
            gameRunningRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [durationMs]);

    // Finish + callback
    useEffect(() => {
        if (!finished) return;

        const isUserWin = userCleared > aiCleared;
        const resultType: BattleMiniGameResultType = isUserWin
            ? "user_win"
            : aiCleared > userCleared
                ? "ai_win"
                : "draw";

        const payload: BattleMiniGameResult = {
            result: resultType,
            userClearedCount: userCleared,
            aiClearedCount: aiCleared,
            reward: isUserWin ? "1 Carrot" : undefined,
        };

        onComplete?.(payload);
    }, [finished, userCleared, aiCleared, onComplete]);

    const triggerUserStun = () => {
        if (userStunnedRef.current) return;
        userStunnedRef.current = true;
        setUserStunned(true);
        setUserJumping(false); // Cancel jump if mid-air collision

        setTimeout(() => {
            userStunnedRef.current = false;
            setUserStunned(false);
        }, STUN_DURATION);
    };

    const triggerUserJump = () => {
        if (userJumping || userStunnedRef.current || finished) return;
        setUserJumping(true);
        setTimeout(() => {
            setUserJumping(false);
        }, JUMP_DURATION);
    };

    const triggerAIJump = () => {
        if (aiJumping || finished) return;
        setAiJumping(true);
        setTimeout(() => {
            setAiJumping(false);
        }, JUMP_DURATION);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            triggerUserJump();
        }
    };

    const handleClick = () => {
        triggerUserJump();
    };

    const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));

    return (
        <div
            ref={containerRef}
            className="w-full max-w-4xl mx-auto mt-4 rounded-xl relative overflow-hidden shadow-2xl select-none outline-none font-sans group"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            style={{
                height: '400px',
                background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)', // Nice sky blue
                fontFamily: '"Press Start 2P", cursive, sans-serif' // If available, else sans
            }}
        >
            {/* Parallax Background Elements */}
            {/* Distant Mountains */}
            <div className="absolute bottom-12 left-0 right-0 h-48 opacity-40 pointer-events-none">
                <div className="absolute bottom-0 left-10 w-64 h-48 bg-[#a2d9e6] rounded-t-full" />
                <div className="absolute bottom-0 left-60 w-80 h-64 bg-[#91cddb] rounded-t-full" />
                <div className="absolute bottom-0 right-20 w-96 h-56 bg-[#b3e5f0] rounded-t-full" />
            </div>

            {/* Clouds */}
            <div className="absolute top-10 left-[10%] text-white/60 text-6xl animate-[cloud-move_40s_linear_infinite]">☁</div>
            <div className="absolute top-24 left-[60%] text-white/50 text-4xl animate-[cloud-move_50s_linear_infinite_reverse]">☁</div>

            {/* HUD */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-30 text-[#535353] font-bold">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest opacity-70">Player</span>
                    <span className="text-3xl">{userCleared.toString().padStart(3, '0')}</span>
                </div>

                <div className="flex flex-col items-center bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-xs uppercase tracking-widest opacity-70">Time</span>
                    <span className="text-xl">{remainingSeconds}s</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-widest opacity-70">AI Opponent</span>
                    <span className="text-3xl">{aiCleared.toString().padStart(3, '0')}</span>
                </div>
            </div>

            {/* Game Area */}
            <div className="absolute inset-0 flex flex-col pt-16 pb-4">
                {/* AI Lane (Top) */}
                <Lane
                    label={aiLaneLabel}
                    isUser={false}
                    isJumping={aiJumping}
                    isStunned={false}
                    obstacles={obstacles.filter((o) => o.lane === "ai")}
                />

                {/* Separator Line */}
                <div className="h-px bg-black/10 w-full my-2" />

                {/* User Lane (Bottom) */}
                <Lane
                    label={userLaneLabel}
                    isUser
                    isJumping={userJumping}
                    isStunned={userStunned}
                    obstacles={obstacles.filter((o) => o.lane === "user")}
                />
            </div>

            {/* Instructions */}
            {elapsed < 3000 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                    <div className="bg-black/80 text-white px-6 py-3 rounded-lg animate-pulse font-mono text-sm">
                        PRESS SPACE TO JUMP
                    </div>
                </div>
            )}

            {/* Game Over */}
            {finished && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform scale-110">
                        <div className="text-4xl mb-2">
                            {userCleared > aiCleared ? "🏆" : aiCleared > userCleared ? "🤖" : "🤝"}
                        </div>
                        <h2 className="text-3xl font-black text-gray mb-2">
                            {userCleared > aiCleared ? "VICTORY!" : aiCleared > userCleared ? "DEFEAT" : "DRAW"}
                        </h2>
                        <div className="text-gray font-mono mb-4">
                            SCORE: {userCleared}
                        </div>
                        <div className="text-xs text-gray animate-pulse">
                            Redirecting...
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface LaneProps {
    label: string;
    isUser: boolean;
    isJumping: boolean;
    isStunned: boolean;
    obstacles: Obstacle[];
}

function Lane({ label, isUser, isJumping, isStunned, obstacles }: LaneProps) {
    return (
        <div className="relative flex-1 w-full overflow-hidden" title={label}>
            {/* Ground Line */}
            <div className="absolute bottom-4 left-0 right-0 h-px bg-[#535353] w-full" />

            {/* Moving Ground Dots/Texture */}
            <div className="absolute bottom-2 left-0 right-0 h-4 overflow-hidden opacity-30">
                <div className="absolute inset-0 animate-[ground-scroll_2s_linear_infinite] flex">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-2 h-0.5 bg-[#535353] mx-12 mt-2 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Character */}
            <div
                className={`absolute bottom-4 w-10 h-10 transition-transform duration-100 z-10 ${isStunned ? "opacity-50 grayscale" : ""}`}
                style={{
                    left: '15%', // Fixed horizontal position
                    transform: isJumping
                        ? "translateY(-60px)"
                        : isStunned
                            ? "translateY(0) scaleY(0.8)"
                            : "translateY(0)",
                }}
            >
                {/* Dino-like Character */}
                <div className={`w-full h-full relative ${isUser ? "text-[#535353]" : "text-[#888]"}`}>
                    {/* Head */}
                    <div className="absolute top-0 right-0 w-6 h-6 bg-current rounded-sm" />
                    {/* Eye */}
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white" />
                    {/* Snout */}
                    <div className="absolute top-2 -right-2 w-3 h-2 bg-current rounded-sm" />
                    {/* Body */}
                    <div className="absolute top-5 left-2 w-5 h-4 bg-current rounded-sm" />
                    {/* Tail */}
                    <div className="absolute top-4 left-0 w-2 h-2 bg-current rounded-sm" />

                    {/* Legs */}
                    {!isJumping && (
                        <>
                            <div className="absolute bottom-0 left-3 w-1 h-3 bg-current animate-[leg-run_0.2s_infinite_alternate]" />
                            <div className="absolute bottom-0 left-5 w-1 h-3 bg-current animate-[leg-run_0.2s_infinite_alternate-reverse]" />
                        </>
                    )}
                </div>
            </div>

            {/* Obstacles */}
            {obstacles.map((o) => (
                <div
                    key={o.id}
                    className="absolute bottom-4 flex flex-col items-center justify-end"
                    style={{ left: o.x, width: 40, height: 40 }}
                >
                    {o.type.includes("cactus") && (
                        <div className="flex items-end justify-center w-full h-full text-[#535353]">
                            {/* Main Stem */}
                            <div className={`bg-current rounded-t-sm ${o.type === 'cactus_large' ? 'w-4 h-10' : 'w-3 h-6'}`} />
                            {/* Arm Left */}
                            <div className={`bg-current rounded-t-sm -ml-1 mb-2 ${o.type === 'cactus_large' ? 'w-2 h-4' : 'w-1 h-2'}`} />
                            {/* Arm Right */}
                            <div className={`bg-current rounded-t-sm -mr-1 mb-3 ${o.type === 'cactus_large' ? 'w-2 h-3' : 'w-1 h-2'}`} />
                        </div>
                    )}
                    {o.type === "bird" && (
                        <div className="absolute bottom-8 w-8 h-6 text-[#535353]">
                            {/* Bird Body */}
                            <div className="w-full h-full bg-current rounded-full relative">
                                {/* Wing */}
                                <div className="absolute -top-2 left-2 w-4 h-2 bg-current rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <style>{`
                @keyframes cloud-move {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100vw); }
                }
                @keyframes ground-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes leg-run {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-2px); }
                }
            `}</style>
        </div>
    );
}
