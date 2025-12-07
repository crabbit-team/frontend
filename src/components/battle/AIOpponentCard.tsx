import { motion } from "framer-motion";
import type { AIBattleStrategy } from "../../api/battle";
import { Bot, TrendingUp, Zap } from "lucide-react";

interface AIOpponentCardProps {
    opponent: AIBattleStrategy;
    onSelect: (opponent: AIBattleStrategy) => void;
}

export function AIOpponentCard({ opponent, onSelect }: AIOpponentCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opponent)}
            className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-carrot-orange/50 hover:shadow-[0_0_30px_rgba(208,129,65,0.3)] transition-all duration-300"
        >
            <div className="p-6 space-y-4">
                {/* Avatar & Header */}
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-error to-warning flex items-center justify-center shadow-[0_0_20px_rgba(208,129,65,0.4)]">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold font-pixel text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-carrot-orange group-hover:to-pink transition-all">
                            {opponent.name}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray font-mono leading-relaxed">
                    {opponent.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray uppercase tracking-wider font-mono">
                            <Zap className="w-3 h-3" />
                            <span>Tokens</span>
                        </div>
                        <div className="text-2xl font-bold text-carrot-orange font-pixel">
                            {opponent.tokens?.length ?? 0}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray uppercase tracking-wider font-mono">
                            <TrendingUp className="w-3 h-3" />
                            <span>Strategy ID</span>
                        </div>
                        <div className="text-sm font-bold text-info font-mono truncate">
                            #{opponent.id}
                        </div>
                    </div>
                </div>

                {/* Tokens */}
                {opponent.tokens && opponent.tokens.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <div className="text-xs text-gray uppercase tracking-wider font-mono">
                            Tokens
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {opponent.tokens.slice(0, 4).map((token, idx) => (
                                <div
                                    key={`${token}-${idx}`}
                                    className="px-2 py-1 bg-carrot-orange/10 border border-carrot-orange/20 rounded text-xs font-mono text-carrot-orange-foreground"
                                >
                                    {token.slice(0, 6)}...{token.slice(-4)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Select Button */}
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-carrot-orange to-carrot-orange text-carrot-orange-foreground font-bold font-pixel text-sm rounded-lg hover:shadow-[0_0_25px_rgba(208,129,65,0.6)] transition-all">
                    CHALLENGE THIS AI
                </button>
            </div>
        </motion.div>
    );
}
