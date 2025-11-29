import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sparkles } from "lucide-react";
import { useEffect } from "react";

interface RewardPopupProps {
    isOpen: boolean;
    amount: number;
    onClose: () => void;
}

export function RewardPopup({ isOpen, amount, onClose }: RewardPopupProps) {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    transition={{ type: "spring", duration: 0.7 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]"
                >
                    <div className="relative bg-gradient-to-br from-yellow-900/90 to-orange-900/90 backdrop-blur-md border-2 border-yellow-500/50 rounded-2xl p-8 shadow-[0_0_80px_rgba(234,179,8,0.8)]">
                        {/* Sparkle Effects */}
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute -top-4 -right-4"
                        >
                            <Sparkles className="w-8 h-8 text-yellow-400" />
                        </motion.div>
                        <motion.div
                            animate={{
                                rotate: -360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                            }}
                            className="absolute -bottom-4 -left-4"
                        >
                            <Sparkles className="w-8 h-8 text-yellow-400" />
                        </motion.div>

                        {/* Content */}
                        <div className="flex flex-col items-center gap-4 min-w-[300px]">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.8)]"
                            >
                                <Coins className="w-10 h-10 text-white" />
                            </motion.div>

                            <div className="text-center">
                                <div className="text-sm font-mono text-yellow-200 uppercase tracking-wider mb-2">
                                    Reward Claimed!
                                </div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="text-5xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400"
                                >
                                    +{amount} CRT
                                </motion.div>
                            </div>

                            {/* Particle Effects */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [1, 1, 0],
                                        scale: [0, 1, 0.5],
                                        x: Math.cos((i * Math.PI) / 3) * 100,
                                        y: Math.sin((i * Math.PI) / 3) * 100,
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                    className="absolute w-2 h-2 rounded-full bg-yellow-400"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
