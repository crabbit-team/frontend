import { motion } from "framer-motion";
import { Swords, Trophy, Coins, ArrowLeft } from "lucide-react";
import type { Vault, AIOpponent } from "../../lib/mockData";
import { Bot, Shield } from "lucide-react";

interface BattleArenaProps {
    vault: Vault;
    opponent: AIOpponent;
    onStartBattle: () => void;
    onBack: () => void;
}

export function BattleArena({ vault, opponent, onStartBattle, onBack }: BattleArenaProps) {
    return (
        <div className="min-h-screen bg-[#0c0b10] text-white p-6">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />
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
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-mono">Change Selection</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            BATTLE ARENA
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mt-2">Prepare for combat</p>
                    </div>
                    <div className="w-32" /> {/* Spacer for centering */}
                </motion.div>

                {/* Battle Info Cards */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#13121a] border border-purple-500/20 rounded-xl p-4 text-center"
                    >
                        <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-400 font-mono uppercase">Entry Fee</div>
                        <div className="text-2xl font-bold font-pixel text-yellow-400">100 CRT</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#13121a] border border-purple-500/20 rounded-xl p-4 text-center"
                    >
                        <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-400 font-mono uppercase">Prize Pool</div>
                        <div className="text-2xl font-bold font-pixel text-purple-400">200 CRT</div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#13121a] border border-purple-500/20 rounded-xl p-4 text-center"
                    >
                        <Swords className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-400 font-mono uppercase">Duration</div>
                        <div className="text-2xl font-bold font-pixel text-cyan-400">1 MIN</div>
                    </motion.div>
                </div>

                {/* VS Section */}
                <div className="relative mb-12">
                    {/* Center VS Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.6)] border-4 border-[#0c0b10]">
                            <Swords className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Player Vault Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-2 border-purple-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(124,58,237,0.3)]"
                        >
                            <div className="text-center mb-4">
                                <div className="inline-block px-4 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs font-bold font-pixel text-purple-400 uppercase mb-4">
                                    Your Strategy
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold font-pixel text-white mb-2">{vault.name}</h3>
                                <p className="text-sm text-gray-400 font-mono mb-4">by {vault.manager}</p>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500 font-mono uppercase">APY</div>
                                        <div className="text-xl font-bold font-pixel text-green-400">{vault.apy}%</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500 font-mono uppercase">TVL</div>
                                        <div className="text-xl font-bold font-pixel text-blue-400">${(vault.tvl / 1000).toFixed(0)}K</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Opponent Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                        >
                            <div className="text-center mb-4">
                                <div className="inline-block px-4 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-xs font-bold font-pixel text-red-400 uppercase mb-4">
                                    AI Opponent
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${opponent.avatar} flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.5)]`}>
                                    <Bot className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold font-pixel text-white mb-2">{opponent.name}</h3>
                                <p className="text-sm text-gray-400 font-mono mb-2">{opponent.specialty}</p>
                                <div className="inline-block px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded text-xs font-bold font-pixel text-orange-400 uppercase mb-4">
                                    {opponent.difficulty}
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500 font-mono uppercase">Win Rate</div>
                                        <div className="text-xl font-bold font-pixel text-purple-400">{opponent.winRate}%</div>
                                    </div>
                                    <div className="bg-black/30 rounded-lg p-3 text-center">
                                        <div className="text-xs text-gray-500 font-mono uppercase">Level</div>
                                        <div className="text-xl font-bold font-pixel text-cyan-400">AI</div>
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
                        className="px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold font-pixel text-2xl rounded-xl shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:shadow-[0_0_70px_rgba(124,58,237,0.8)] transition-all duration-500 transform hover:scale-105 animate-pulse"
                    >
                        START BATTLE
                    </button>
                    <p className="text-sm text-gray-500 font-mono mt-4">The battle will last 60 seconds</p>
                </motion.div>
            </div>
        </div>
    );
}
