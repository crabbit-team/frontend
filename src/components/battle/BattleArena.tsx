import { motion } from "framer-motion";
import { Swords, Trophy, Coins, ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { VaultSummary } from "../../api/vault";
import type { AIBattleStrategy } from "../../api/battle";
import { CardWithFrame } from "../common/CardWithFrame";

interface BattleArenaProps {
    vault: VaultSummary;
    opponent: AIBattleStrategy;
    onStartBattle: () => void;
    onBack: () => void;
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

export function BattleArena({ vault, opponent, onStartBattle, onBack }: BattleArenaProps) {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    // 내 전략 카드: creator/deposit 구분 없이 표시 (기본적으로 orange 프레임 사용)
    const myStrategyFrameImage = "/card/frame/cardFrameOrange.png";
    const myStrategyBackgroundImage = vault.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
    const roi = vault.performance?.apy ?? 0;
    const tvlFormatted = formatTVL(vault.tvl);

    // AI 전략 카드: bronze 프레임 사용
    const aiStrategyFrameImage = "/card/frame/cardFrameBronze.png";
    const aiStrategyBackgroundImage = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";

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
                        <div className="text-2xl font-bold font-pixel text-carrot-orange">10,000,000 CRT</div>
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
                    <div className="grid grid-cols-2 gap-8">
                        {/* Player Strategy Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <CardWithFrame
                                frameImage={myStrategyFrameImage}
                                backgroundImage={myStrategyBackgroundImage}
                                size="small"
                                backgroundSize="cover"
                                animationDelay={0.4}
                            >
                                {/* 카드 정보 - 하단 */}
                                <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10">
                                        <div className="text-center mb-2">
                                            <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">
                                                Your Strategy
                                            </div>
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

                        {/* AI Strategy Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <CardWithFrame
                                frameImage={aiStrategyFrameImage}
                                backgroundImage={aiStrategyBackgroundImage}
                                size="small"
                                backgroundSize="cover"
                                animationDelay={0.4}
                            >
                                {/* 카드 정보 - 하단 */}
                                <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10">
                                        <div className="text-center mb-2">
                                            <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">
                                                AI Strategy
                                            </div>
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
                        onClick={isConnected ? onStartBattle : () => openConnectModal?.()}
                        disabled={!isConnected}
                        className={`px-16 py-6 font-bold font-pixel text-2xl rounded-xl transition-all duration-500 ${
                            isConnected
                                ? "bg-gradient-to-r from-carrot-orange via-pink to-carrot-orange bg-size-200 bg-pos-0 hover:bg-pos-100 text-carrot-orange-foreground shadow-[0_0_50px_rgba(208,129,65,0.6)] hover:shadow-[0_0_70px_rgba(208,129,65,0.8)] transform hover:scale-105 animate-pulse cursor-pointer"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                        }`}
                    >
                        START BATTLE
                    </button>
                    {!isConnected ? (
                        <p className="text-sm text-muted-foreground font-mono mt-4">Please connect your wallet to start a battle</p>
                    ) : (
                        <p className="text-sm text-muted-foreground font-mono mt-4">The battle will last 60 seconds</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
