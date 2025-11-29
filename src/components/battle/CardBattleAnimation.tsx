import { motion } from "framer-motion";
import { Shield, Bot } from "lucide-react";
import type { Vault, AIOpponent } from "../../lib/mockData";

interface CardBattleAnimationProps {
    vault: Vault;
    opponent: AIOpponent;
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
                <div className="w-48 h-64 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-purple-500/50 rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.5)] backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/30" />
                    <div className="relative p-6 flex flex-col items-center justify-center h-full">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(124,58,237,0.5)",
                                    "0 0 40px rgba(124,58,237,0.8)",
                                    "0 0 20px rgba(124,58,237,0.5)"
                                ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4"
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold font-pixel text-white text-center">{vault.name}</h3>
                        <p className="text-xs text-purple-400 font-mono mt-2">YOUR STRATEGY</p>
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl" />
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
                <div className="w-48 h-64 bg-gradient-to-br from-red-900/50 to-orange-900/50 border-2 border-red-500/50 rounded-xl shadow-[0_0_40px_rgba(239,68,68,0.5)] backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/30" />
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
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${opponent.avatar} flex items-center justify-center mb-4`}
                        >
                            <Bot className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-lg font-bold font-pixel text-white text-center">{opponent.name}</h3>
                        <p className="text-xs text-red-400 font-mono mt-2">AI OPPONENT</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
