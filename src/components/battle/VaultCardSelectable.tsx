import { motion } from "framer-motion";
import type { Vault } from "../../lib/mockData";
import { TrendingUp, Shield, DollarSign } from "lucide-react";

interface VaultCardSelectableProps {
    vault: Vault;
    onSelect: (vault: Vault) => void;
}

export function VaultCardSelectable({ vault, onSelect }: VaultCardSelectableProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(vault)}
            className="group cursor-pointer bg-[#13121a] border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300"
        >
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold font-pixel text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                            {vault.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono mt-1">by {vault.manager}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 font-mono leading-relaxed line-clamp-2">
                    {vault.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-mono">
                            <TrendingUp className="w-3 h-3" />
                            <span>APY</span>
                        </div>
                        <div className="text-2xl font-bold text-green-400 font-pixel">
                            {vault.apy}%
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider font-mono">
                            <DollarSign className="w-3 h-3" />
                            <span>TVL</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400 font-pixel">
                            ${(vault.tvl / 1000).toFixed(0)}K
                        </div>
                    </div>
                </div>

                {/* Holdings */}
                <div className="space-y-2 pt-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">Holdings</div>
                    <div className="flex gap-2">
                        {vault.holdings.slice(0, 3).map((holding, idx) => (
                            <div
                                key={idx}
                                className="px-2 py-1 bg-purple-600/10 border border-purple-500/20 rounded text-xs font-mono text-purple-400"
                            >
                                {holding.token} {holding.allocation}%
                            </div>
                        ))}
                    </div>
                </div>

                {/* Select Button */}
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold font-pixel text-sm rounded-lg hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all">
                    SELECT
                </button>
            </div>
        </motion.div>
    );
}
