import { motion } from "framer-motion";
import type { AIOpponent } from "../../lib/mockData";
import { Bot, TrendingUp, Zap } from "lucide-react";

interface AIOpponentCardProps {
    opponent: AIOpponent;
    onSelect: (opponent: AIOpponent) => void;
}

const difficultyColors = {
    Easy: "border-green-500/30 bg-green-500/10 text-green-400",
    Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    Hard: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    Expert: "border-red-500/30 bg-red-500/10 text-red-400"
};

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
                        <div className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold uppercase border ${difficultyColors[opponent.difficulty]}`}>
                            {opponent.difficulty}
                        </div>
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
                            <span>Win Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400 font-pixel">
                            {opponent.winRate}%
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-mono">
                            <Zap className="w-3 h-3" />
                            <span>Specialty</span>
                        </div>
                        <div className="text-sm font-bold text-cyan-400 font-mono truncate">
                            {opponent.specialty}
                        </div>
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
