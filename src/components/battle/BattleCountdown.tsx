import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import type { VaultSummary } from "../../api/vault";
import type { AIBattleStrategy } from "../../api/battle";
import { BattleMiniGame, type BattleMiniGameResult } from "./BattleMiniGame";

interface BattleCountdownProps {
    countdown: number;
    vault: VaultSummary;
    opponent: AIBattleStrategy;
}

// Mock battle log messages
const battleLogMessages = [
    "Analyzing market conditions...",
    "AI calculating optimal entry points...",
    "Your strategy deploying capital...",
    "AI adjusting portfolio allocation...",
    "Market volatility detected!",
    "Your vault executing trades...",
    "AI opponent taking position...",
    "Both strategies adapting to trends...",
    "Risk management systems active...",
    "Final countdown to results..."
];

export function BattleCountdown({ countdown }: BattleCountdownProps) {
    const progress = ((60 - countdown) / 60) * 100;
    const currentMessageIndex = Math.floor(((60 - countdown) / 60) * battleLogMessages.length);
    const currentMessage = battleLogMessages[Math.min(currentMessageIndex, battleLogMessages.length - 1)];

    const handleMiniGameComplete = (result: BattleMiniGameResult) => {
        // Stub reward / result handlers for now – parent battle flow still uses ROI logic.
        if (result.result === "user_win") {
            // Example: grant CVT rewards equivalent to 1 USDT
            grantBattleReward({
                token: "CVT",
                usdtValue: 1,
                result: result.result,
                userClearedCount: result.userClearedCount,
                aiClearedCount: result.aiClearedCount,
            });
        } else {
            handleBattleResult({
                result: result.result,
                userClearedCount: result.userClearedCount,
                aiClearedCount: result.aiClearedCount,
            });
        }
    };

    // Simple stubs to demonstrate how reward / result callbacks could be wired.
    const grantBattleReward = (payload: {
        token: string;
        usdtValue: number;
        result: "user_win";
        userClearedCount: number;
        aiClearedCount: number;
    }) => {
        // In a real implementation, this would trigger on-chain / backend reward logic.
        console.log("grantBattleReward", payload);
    };

    const handleBattleResult = (payload: {
        result: "ai_win" | "draw";
        userClearedCount: number;
        aiClearedCount: number;
    }) => {
        console.log("handleBattleResult", payload);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-carrot-orange/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.2, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink/30 rounded-full blur-[120px]"
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 w-full">
                {/* Countdown Timer */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-carrot-orange/50 to-pink/50 border-2 border-carrot-orange/50 rounded-full shadow-[0_0_50px_rgba(208,129,65,0.5)] mb-4">
                        <Clock className="w-8 h-8 text-carrot-orange" />
                        <motion.div
                            key={countdown}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-6xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-carrot-orange to-pink"
                        >
                            {countdown}
                        </motion.div>
                    </div>
                    <motion.p
                        animate={{
                            opacity: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="text-gray font-mono text-sm"
                    >
                        BATTLE IN PROGRESS
                    </motion.p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="relative h-4 bg-card border border-carrot-orange/30 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-carrot-orange via-pink to-carrot-orange shadow-[0_0_20px_rgba(208,129,65,0.6)]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    </div>
                </motion.div>

                {/* Mini-game (centered, Chrome Dino-style) */}
                <div className="mb-12 flex justify-center">
                    <BattleMiniGame onComplete={handleMiniGameComplete} />
                </div>

                {/* Battle Log */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-carrot-orange/20 rounded-xl p-6 max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-carrot-orange" />
                        <h3 className="text-sm font-bold font-pixel text-carrot-orange uppercase">Battle Log</h3>
                    </div>
                    <div className="space-y-2">
                        <motion.div
                            key={currentMessage}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <span className="text-gray font-mono text-xs">{String(60 - countdown).padStart(2, '0')}s</span>
                            <span className="text-gray-foreground font-mono text-sm">{currentMessage}</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ROI Preview (Mock) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: countdown < 10 ? 1 : 0 }}
                    className="mt-8 grid grid-cols-2 gap-4 max-w-2xl mx-auto"
                >
                    <div className="bg-carrot-orange/20 border border-carrot-orange/30 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray font-mono mb-1">YOUR ROI</div>
                        <motion.div
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity
                            }}
                            className="text-2xl font-bold font-pixel text-carrot-orange"
                        >
                            ???%
                        </motion.div>
                    </div>
                    <div className="bg-error/20 border border-error/30 rounded-lg p-4 text-center">
                        <div className="text-xs text-gray font-mono mb-1">AI ROI</div>
                        <motion.div
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: 0.5
                            }}
                            className="text-2xl font-bold font-pixel text-error"
                        >
                            ???%
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
