import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, RotateCcw, Home } from "lucide-react";
import type { VaultSummary } from "../../api/vault";
import type { AIBattleStrategy } from "../../api/battle";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export interface BattleResult {
    playerWon: boolean;
    playerROI: number;
    opponentROI: number;
    rewardAmount: number;
}

interface BattleResultModalProps {
    isOpen: boolean;
    result: BattleResult;
    vault: VaultSummary;
    opponent: AIBattleStrategy;
    onClaimReward: () => void;
    onTryAgain: () => void;
    onReturnHome: () => void;
}

export function BattleResultModal({
    isOpen,
    result,
    vault,
    opponent,
    onClaimReward,
    onTryAgain,
    onReturnHome
}: BattleResultModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (isOpen && result.playerWon) {
            setShowConfetti(true);
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, result.playerWon]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Confetti */}
                    {showConfetti && result.playerWon && (
                        <Confetti
                            width={dimensions.width}
                            height={dimensions.height}
                            recycle={false}
                            numberOfPieces={500}
                            gravity={0.3}
                        />
                    )}

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", duration: 0.7 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-4xl bg-background border-2 border-carrot-orange/50 rounded-2xl shadow-[0_0_80px_rgba(208,129,65,0.5)] overflow-hidden">
                            {/* Header */}
                            <div className={`relative border-b border-white/10 p-8 ${result.playerWon ? 'bg-gradient-to-r from-carrot-orange/40 to-pink/40' : 'bg-gradient-to-r from-error/40 to-warning/40'}`}>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", delay: 0.3 }}
                                    className="text-center"
                                >
                                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${result.playerWon ? 'bg-gradient-to-br from-warning to-warning' : 'bg-gradient-to-br from-gray to-gray'} shadow-[0_0_40px_rgba(234,179,8,0.6)]`}>
                                        <Trophy className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-5xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-carrot-orange to-pink mb-2">
                                        {result.playerWon ? 'VICTORY!' : 'DEFEAT'}
                                    </h2>
                                    <p className="text-muted-foreground font-mono">
                                        {result.playerWon
                                            ? 'You outperformed the AI opponent!'
                                            : 'The AI was stronger this time'}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Results Content */}
                            <div className="p-8 space-y-8">
                                {/* ROI Comparison */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold font-pixel text-carrot-orange text-center uppercase">
                                        ROI Comparison
                                    </h3>

                                    {/* Player ROI */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono text-muted-foreground">Your Strategy</span>
                                                <span className="text-sm font-bold text-white">{vault.name}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 font-pixel text-2xl ${result.playerROI >= 0 ? 'text-success' : 'text-error'}`}>
                                                {result.playerROI >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                                {result.playerROI >= 0 ? '+' : ''}{result.playerROI}%
                                            </div>
                                        </div>
                                        <div className="relative h-12 bg-card border border-carrot-orange/30 rounded-lg overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.abs(result.playerROI) * 3}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`absolute inset-y-0 left-0 ${result.playerROI >= 0 ? 'bg-gradient-to-r from-success to-success' : 'bg-gradient-to-r from-error to-error'} shadow-[0_0_20px_rgba(34,197,94,0.5)]`}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold font-mono relative z-10">
                                                    {result.playerROI >= 0 ? '+' : ''}{result.playerROI}% ROI
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* AI ROI */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono text-muted-foreground">AI Opponent</span>
                                                <span className="text-sm font-bold text-white">{opponent.name}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 font-pixel text-2xl ${result.opponentROI >= 0 ? 'text-success' : 'text-error'}`}>
                                                {result.opponentROI >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                                {result.opponentROI >= 0 ? '+' : ''}{result.opponentROI}%
                                            </div>
                                        </div>
                                        <div className="relative h-12 bg-card border border-error/30 rounded-lg overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.abs(result.opponentROI) * 3}%` }}
                                                transition={{ duration: 1, delay: 0.7 }}
                                                className={`absolute inset-y-0 left-0 ${result.opponentROI >= 0 ? 'bg-gradient-to-r from-success to-success' : 'bg-gradient-to-r from-error to-error'}`}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold font-mono relative z-10">
                                                    {result.opponentROI >= 0 ? '+' : ''}{result.opponentROI}% ROI
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Reward Box (if won) */}
                                {result.playerWon && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-gradient-to-r from-warning/20 to-warning/20 border-2 border-warning/50 rounded-xl p-6 text-center"
                                    >
                                        <div className="text-sm text-warning font-mono uppercase mb-2">Reward Earned</div>
                                        <div className="text-5xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-warning to-warning">
                                            +{result.rewardAmount} CRT
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    {result.playerWon ? (
                                        <button
                                            onClick={onClaimReward}
                                            className="flex-1 py-4 bg-gradient-to-r from-warning to-warning text-white font-bold font-pixel text-lg rounded-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all transform hover:scale-105"
                                        >
                                            CLAIM REWARD
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onTryAgain}
                                            className="flex-1 py-4 bg-gradient-to-r from-carrot-orange to-carrot-orange text-carrot-orange-foreground font-bold font-pixel text-lg rounded-lg hover:shadow-[0_0_30px_rgba(208,129,65,0.6)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                            TRY AGAIN
                                        </button>
                                    )}
                                    <button
                                        onClick={onReturnHome}
                                        className="px-6 py-4 bg-white/5 border border-white/10 text-white font-bold font-pixel text-lg rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                                    >
                                        <Home className="w-5 h-5" />
                                        HOME
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
