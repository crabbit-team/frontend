import { motion } from "framer-motion";
import type { AIBattleStrategy } from "../../api/battle";
import { CardWithFrame } from "../common/CardWithFrame";
import { TierBadge } from "../common/TierBadge";

interface AIOpponentCardProps {
    opponent: AIBattleStrategy;
    onSelect: (opponent: AIBattleStrategy) => void;
}

export function AIOpponentCard({ opponent, onSelect }: AIOpponentCardProps) {
    // AI 전략 카드: bronze 프레임 사용
    const frameImage = "/card/frame/cardFrameBronze.png";
    const backgroundImage = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opponent)}
            className="cursor-pointer"
        >
            <CardWithFrame
                frameImage={frameImage}
                backgroundImage={backgroundImage}
                size="small"
                backgroundSize="cover"
            >
                {/* Tier Badge - 왼쪽 위 (AI는 기본적으로 bronze tier) */}
                <div className="absolute top-4 left-4 z-30">
                    <TierBadge tier="bronze" />
                </div>
                
                {/* 카드 정보 - 하단 */}
                <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10">
                        <div className="text-center mb-2">
                            <h3 className="text-xs font-bold font-pixel text-white truncate">
                                {opponent.name}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">Tokens</span>
                            <span className="text-xs font-bold font-pixel text-white">
                                {opponent.tokens?.length ?? 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">Strategy ID</span>
                            <span className="text-xs font-bold font-pixel text-white">#{opponent.id}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono text-center mt-2 line-clamp-2">
                            {opponent.description}
                        </div>
                    </div>
                </div>
            </CardWithFrame>
        </motion.div>
    );
}
