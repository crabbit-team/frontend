import { motion } from "framer-motion";
import type { AIOpponent } from "../../lib/mockData";
import { Bot, TrendingUp, Zap } from "lucide-react";

interface AIOpponentCardProps {
    opponent: AIOpponent;
    onSelect: (opponent: AIOpponent) => void;
}

export function AIOpponentCard({ opponent, onSelect }: AIOpponentCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opponent)}
            className="group cursor-pointer bg-[#13121a] border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300"
        >
            <div className="p-6 space-y-4">
                {/* Avatar & Header */}
                <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${opponent.avatar} flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]`}>
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold font-pixel text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                            {opponent.name}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 font-mono leading-relaxed">
                    {opponent.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-mono">
                            <TrendingUp className="w-3 h-3" />
                            <span>APY</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400 font-pixel">
                            {opponent.apy}%
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-mono">
                            <Zap className="w-3 h-3" />
                            <span>TVL</span>
                        </div>
                        <div className="text-sm font-bold text-cyan-400 font-mono truncate">
                            ${Math.round(opponent.tvl / 1000).toLocaleString()}K
                        </div>
                    </div>
                </div>

                {/* Holdings (allocation only, no chart) */}
                <div className="space-y-2 pt-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                        Holdings
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {opponent.holdings.slice(0, 4).map((holding, idx) => (
                            <div
                                key={`${holding.token}-${idx}`}
                                className="px-2 py-1 bg-purple-600/10 border border-purple-500/20 rounded text-xs font-mono text-purple-300"
                            >
                                {holding.token} {holding.allocation}%
                            </div>
                        ))}
                    </div>
                </div>

                {/* Select Button */}
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold font-pixel text-sm rounded-lg hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all">
                    CHALLENGE THIS AI
                </button>
            </div>
        </motion.div>
    );
}
