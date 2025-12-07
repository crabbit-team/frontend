import { motion } from "framer-motion";
import type { VaultSummary } from "../../api/vault";
import { CardWithFrame } from "../common/CardWithFrame";
import { TierBadge } from "../common/TierBadge";

interface VaultCardSelectableProps {
    vault: VaultSummary;
    onSelect: (vault: VaultSummary) => void;
}

function formatTVL(tvlString: string): string {
    const tvl = parseFloat(tvlString);
    if (tvl >= 1_000_000_000) {
        return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
    }
    if (tvl >= 1_000_000) {
        return `$${(tvl / 1_000_000).toFixed(1)}M`;
    }
    if (tvl >= 1_000) {
        return `$${(tvl / 1_000).toFixed(1)}K`;
    }
    return `$${tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function VaultCardSelectable({ vault, onSelect }: VaultCardSelectableProps) {
    // 내 전략 카드: creator/deposit 구분 없이 표시 (기본적으로 orange 프레임 사용)
    const frameImage = "/card/frame/cardFrameOrange.png";
    const backgroundImage = vault.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
    const roi = vault.performance?.apy ?? 0;
    const tvlFormatted = formatTVL(vault.tvl);

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(vault)}
            className="cursor-pointer"
        >
            <CardWithFrame
                frameImage={frameImage}
                backgroundImage={backgroundImage}
                size="small"
                backgroundSize="cover"
            >
                {/* Tier Badge - 왼쪽 위 */}
                <div className="absolute top-4 left-4 z-30">
                    <TierBadge tier={vault.tier || "iron"} />
                </div>
                
                {/* 카드 정보 - 하단 */}
                <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10">
                        <div className="text-center mb-2">
                            <h3 className="text-xs font-bold font-pixel text-white truncate">
                                {vault.name}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">Ticker</span>
                            <span className="text-xs font-bold font-pixel text-white">{vault.symbol}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">ROI</span>
                            <span className="text-xs font-bold font-pixel text-success">
                                {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">TVL</span>
                            <span className="text-xs font-bold font-pixel text-white">{tvlFormatted} USDC</span>
                        </div>
                    </div>
                </div>
            </CardWithFrame>
        </motion.div>
    );
}
