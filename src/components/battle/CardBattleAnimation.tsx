import { motion } from "framer-motion";
import { Shield, Bot } from "lucide-react";
import type { VaultSummary } from "../../api/vault";
import type { AIBattleStrategy } from "../../api/battle";

interface CardBattleAnimationProps {
    vault: VaultSummary;
    opponent: AIBattleStrategy;
}

export function CardBattleAnimation({ vault, opponent }: CardBattleAnimationProps) {
    return (
        <div className="relative flex items-center justify-center gap-16">
            {/* Player Card */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, -2, 0, 2, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                <div className="w-48 h-64 bg-gradient-to-br from-carrot-orange/50 to-carrot-orange/50 border-2 border-carrot-orange/50 rounded-xl shadow-[0_0_40px_rgba(208,129,65,0.5)] backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-carrot-orange/30" />
                    <div className="relative p-6 flex flex-col items-center justify-center h-full">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(208,129,65,0.5)",
                                    "0 0 40px rgba(208,129,65,0.8)",
                                    "0 0 20px rgba(208,129,65,0.5)"
                                ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-16 h-16 rounded-xl bg-gradient-to-br from-carrot-orange to-carrot-orange flex items-center justify-center mb-4"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold font-pixel text-white text-center">{vault.name}</h3>
                        <p className="text-xs text-carrot-orange font-mono mt-2">YOUR STRATEGY</p>
                    </div>
                </div>
            </motion.div>

            {/* Energy Effect in Center */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-carrot-orange/30 to-pink/30 blur-xl" />
            </motion.div>

            {/* AI Opponent Card */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
                className="relative"
            >
                <div className="w-48 h-64 bg-gradient-to-br from-error/50 to-warning/50 border-2 border-error/50 rounded-xl shadow-[0_0_40px_rgba(239,68,68,0.5)] backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-error/30" />
                    <div className="relative p-6 flex flex-col items-center justify-center h-full">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(239,68,68,0.5)",
                                    "0 0 40px rgba(239,68,68,0.8)",
                                    "0 0 20px rgba(239,68,68,0.5)"
                                ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-warning flex items-center justify-center mb-4"
                        >
                            <Bot className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold font-pixel text-white text-center">{opponent.name}</h3>
                        <p className="text-xs text-error font-mono mt-2">AI OPPONENT</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
