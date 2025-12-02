import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { MOCK_VAULTS } from "../lib/mockData";

export function Rank() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0c0b10] text-white font-tech overflow-hidden relative">
            {/* Background Particles (Simulated with CSS/SVG for performance) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* 1. Rankings Section Title */}
                <div className="mb-16 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold font-pixel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        Strategy Rank
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm tracking-wider">
                        Rank is generated from the strategy owner's historical average ROI. <br />
                        Updated every 24 hours.
                    </p>
                </div>

                {/* 2. Ranking Showcase (Centerpiece) */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 min-h-[200px]">
                    {/* Simple mock spotlight for top 3 strategies */}
                    {(() => {
                        const top3 = MOCK_VAULTS.slice(0, 3);
                        if (top3.length < 3) return null;

                        const spotlight = [
                            { vault: top3[1], rank: 2, position: "left" as const, delay: 0.3 },
                            { vault: top3[0], rank: 1, position: "center" as const, delay: 0.2 },
                            { vault: top3[2], rank: 3, position: "right" as const, delay: 0.4 },
                        ];

                        return spotlight.map(({ vault, rank, position, delay }) => (
                            <RankingCard
                                key={vault.id}
                                user={{
                                    id: vault.id,
                                    rank,
                                    vaultName: vault.name,
                                    owner: vault.manager,
                                    roiUsd: `+$${(vault.apy * 1000).toFixed(0)}`,
                                    tvl: `$${vault.tvl.toLocaleString()}`,
                                    avatar: vault.name.charAt(0).toUpperCase(),
                                }}
                                position={position}
                                delay={delay}
                            />
                        ));
                    })()}
                </div>

                {/* 4. Ranking Table */}
                <div className="bg-[#13121a] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    <div className="grid grid-cols-12 gap-4 p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">Strategy</div>
                        <div className="col-span-2 text-right">ROI (USD)</div>
                        <div className="col-span-2 text-right">TVL</div>
                        <div className="col-span-2 text-right">Deposit</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {MOCK_VAULTS.map((vault, index) => {
                            const rank = index + 1;
                            const roiUsd = (vault.apy * 1000).toFixed(0);
                            const tvlLabel = `$${vault.tvl.toLocaleString()}`;

                            return (
                                <div
                                    key={vault.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center hover:bg-white/5 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/vaults/${vault.id}`)}
                                >
                                    <div className="col-span-1 font-mono text-muted-foreground">
                                        #{rank}
                                    </div>
                                    <div className="col-span-5">
                                        <div className="font-mono text-white">{vault.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            by {vault.manager}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-emerald-400">
                                        +${roiUsd}
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-white/80">
                                        {tvlLabel}
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-muted-foreground">
                                        —
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RankingCard({ user, position, delay }: { user: any, position: 'left' | 'center' | 'right', delay: number }) {
    const isCenter = position === 'center';
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={cn(
                "relative group cursor-pointer",
                isCenter ? "z-20 -mb-8" : "z-10"
            )}
            onClick={() => navigate(`/vaults/${user.id}`)}
        >
            <motion.div
                animate={isCenter ? { y: [-4, 4, -4] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "relative overflow-hidden rounded-2xl border transition-all duration-300",
                    "bg-gradient-to-b from-[#1a1924] to-[#0c0b10]",
                    isCenter
                        ? "w-72 h-96 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                        : "w-64 h-80 border-white/10 shadow-xl hover:border-white/30"
                )}
            >
                {/* Card Glow Effect */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    "bg-gradient-to-b from-transparent via-primary/5 to-primary/10"
                )} />

                {/* Rank Badge */}
                <div className="absolute top-4 left-4">
                    <div className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-lg font-pixel text-lg shadow-lg",
                        isCenter ? "bg-yellow-500 text-black" : "bg-white/10 text-white border border-white/10"
                    )}>
                        #{user.rank}
                    </div>
                </div>

                {/* Avatar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                    <div className={cn(
                        "rounded-full flex items-center justify-center border-4 shadow-2xl",
                        isCenter ? "w-32 h-32 border-yellow-500/30 bg-yellow-500/10 text-6xl" : "w-24 h-24 border-white/10 bg-white/5 text-4xl"
                    )}>
                        {user.avatar}
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className={cn("font-bold tracking-tight", isCenter ? "text-2xl text-white" : "text-xl text-white/80")}>
                            {user.vaultName}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">{user.owner}</p>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ROI (USD)</div>
                            <div className={cn("font-mono font-bold", isCenter ? "text-xl text-green-400" : "text-lg text-green-400/80")}>
                                {user.roiUsd}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TVL</div>
                            <div className="font-mono font-bold text-white">{user.tvl}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
