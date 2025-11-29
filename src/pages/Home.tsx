import { Link } from "react-router-dom";
import { ArrowRight, Trophy, TrendingUp, Sparkles, Crosshair } from "lucide-react";

export function Home() {
    return (
        <div className="space-y-20 pb-16">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-16 md:pt-32 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="inline-block border border-primary/50 bg-primary/10 px-4 py-1 rounded-none font-pixel text-xs text-primary mb-4 animate-pulse">
            // SYSTEM_READY
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto font-pixel leading-tight text-glow">
                        ENTER THE <span className="text-primary">MEME</span> BATTLEGROUND
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-tech tracking-wide">
                        Execute high-frequency trades. Deploy AI strategies. Dominate the leaderboard.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Link
                            to="/battle"
                            className="group relative px-8 py-4 bg-primary text-black font-pixel text-sm hover:bg-primary/90 transition-all clip-path-polygon"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                START_BATTLE <ArrowRight className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform -z-10" />
                        </Link>

                        <Link
                            to="/vaults"
                            className="px-8 py-4 border border-primary/50 text-primary font-pixel text-sm hover:bg-primary/10 transition-all clip-path-polygon"
                        >
                            VIEW_VAULTS
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                <div className="group bg-card/50 border border-primary/20 p-8 hover:border-primary transition-all hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <Crosshair className="w-16 h-16 text-primary/10" />
                    </div>
                    <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/30">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-pixel mb-4 text-primary">PVP_BATTLES</h3>
                    <p className="text-muted-foreground font-tech text-lg">
                        Real-time PNL combat. Challenge traders 1v1. Winner takes the pool.
                    </p>
                </div>

                <div className="group bg-card/50 border border-primary/20 p-8 hover:border-primary transition-all hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <TrendingUp className="w-16 h-16 text-primary/10" />
                    </div>
                    <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/30">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-pixel mb-4 text-primary">STRATEGY_VAULTS</h3>
                    <p className="text-muted-foreground font-tech text-lg">
                        Deposit into high-yield algos. Managed by elite traders and bots.
                    </p>
                </div>

                <div className="group bg-card/50 border border-primary/20 p-8 hover:border-primary transition-all hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-50">
                        <Sparkles className="w-16 h-16 text-primary/10" />
                    </div>
                    <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/30">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-pixel mb-4 text-primary">AI_ARCHITECT</h3>
                    <p className="text-muted-foreground font-tech text-lg">
                        Generate alpha strategies with LLMs. Backtest and deploy instantly.
                    </p>
                </div>
            </section>
        </div>
    );
}
