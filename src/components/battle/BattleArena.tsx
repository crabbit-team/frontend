import { motion } from "framer-motion";
import { Swords, Trophy, Coins, ArrowLeft } from "lucide-react";
import type { VaultSummary } from "../../api/vault";
import type { AIBattleStrategy } from "../../api/battle";
import { Bot, Shield } from "lucide-react";

interface BattleArenaProps {
    vault: VaultSummary;
    opponent: AIBattleStrategy;
    onStartBattle: () => void;
    onBack: () => void;
}

export function BattleArena({ vault, opponent, onStartBattle, onBack }: BattleArenaProps) {
    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-mono">Change Selection</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-carrot-orange to-pink">
                            BATTLE ARENA
                        </h1>
                        <p className="text-muted-foreground font-mono text-sm mt-2">Prepare for combat</p>
                    </div>
                    <div className="w-32" /> {/* Spacer for centering */}
                </motion.div>

                {/* Battle Info Cards */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-carrot-orange/20 rounded-xl p-4 text-center"
                    >
                        <Coins className="w-6 h-6 text-warning mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground font-mono uppercase">Entry Fee</div>
                        <div className="text-2xl font-bold font-pixel text-warning">FREE</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-carrot-orange/20 rounded-xl p-4 text-center"
                    >
                        <Trophy className="w-6 h-6 text-carrot-orange mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground font-mono uppercase">Prize Pool</div>
                        <div className="text-2xl font-bold font-pixel text-carrot-orange">200 CRT</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-carrot-orange/20 rounded-xl p-4 text-center"
                    >
                        <Swords className="w-6 h-6 text-info mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground font-mono uppercase">Duration</div>
                        <div className="text-2xl font-bold font-pixel text-info">1 MIN</div>
                    </motion.div>
                </div>

                {/* VS Section */}
                <div className="relative mb-12">
                    {/* option: Center VS Badge */}

                    <div className="grid grid-cols-2 gap-8">
                        {/* Player Strategy Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-carrot-orange/30 to-carrot-orange/30 border-2 border-carrot-orange/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(208,129,65,0.3)]"
                        >
                            <div className="text-center mb-4">
                                <div className="inline-block px-4 py-1 bg-carrot-orange/20 border border-carrot-orange/30 rounded-full text-xs font-bold font-pixel text-carrot-orange uppercase mb-4">
                                    Your Strategy
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-carrot-orange to-carrot-orange flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(208,129,65,0.5)]">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold font-pixel text-white mb-2">{vault.name}</h3>
                                <p className="text-sm text-muted-foreground font-mono mb-4">
                                    {vault.creator?.address ? `${vault.creator.address.slice(0, 6)}...${vault.creator.address.slice(-4)}` : "Unknown"}
                                </p>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground font-mono uppercase">APY</div>
                                        <div className="text-xl font-bold font-pixel text-success">
                                            {vault.performance?.apy?.toFixed(2) ?? 0}%
                                        </div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground font-mono uppercase">TVL</div>
                                        <div className="text-xl font-bold font-pixel text-info">
                                            ${((typeof vault.tvl === "number" ? vault.tvl : parseFloat(vault.tvl)) / 1000).toFixed(0)}K
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Strategy Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-error/30 to-warning/30 border-2 border-error/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                        >
                            <div className="text-center mb-4">
                                <div className="inline-block px-4 py-1 bg-error/20 border border-error/30 rounded-full text-xs font-bold font-pixel text-error uppercase mb-4">
                                    AI Strategy
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-error to-warning flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                                    <Bot className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold font-pixel text-white mb-2">{opponent.name}</h3>
                                <p className="text-sm text-muted-foreground font-mono mb-2">{opponent.description}</p>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground font-mono uppercase">Tokens</div>
                                        <div className="text-xl font-bold font-pixel text-success">
                                            {opponent.tokens?.length ?? 0}
                                        </div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-muted-foreground font-mono uppercase">Strategy</div>
                                        <div className="text-sm font-bold font-pixel text-info">
                                            #{opponent.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Start Battle Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={onStartBattle}
                        className="px-16 py-6 bg-gradient-to-r from-carrot-orange via-pink to-carrot-orange bg-size-200 bg-pos-0 hover:bg-pos-100 text-carrot-orange-foreground font-bold font-pixel text-2xl rounded-xl shadow-[0_0_50px_rgba(208,129,65,0.6)] hover:shadow-[0_0_70px_rgba(208,129,65,0.8)] transition-all duration-500 transform hover:scale-105 animate-pulse"
                    >
                        START BATTLE
                    </button>
                    <p className="text-sm text-muted-foreground font-mono mt-4">The battle will last 60 seconds</p>
                </motion.div>
            </div>
        </div>
    );
}
