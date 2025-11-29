import { Link } from "react-router-dom";
import type { Battle } from "../../lib/mockData";
import { cn } from "../../lib/utils";
import { Users, Clock, Trophy, ArrowRight, Swords } from "lucide-react";

interface BattleCardProps {
    battle: Battle;
}

export function BattleCard({ battle }: BattleCardProps) {
    const isWaiting = battle.status === 'waiting';
    const isActive = battle.status === 'active';

    return (
        <div className="group bg-card/50 border border-primary/20 hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.1)] relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 clip-path-polygon" />

            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2 py-1 text-[10px] font-pixel uppercase tracking-wider border",
                            isWaiting ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
                                isActive ? "border-green-500/50 text-green-500 bg-green-500/10 animate-pulse" :
                                    "border-gray-500/50 text-gray-500 bg-gray-500/10"
                        )}>
                            {battle.status}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono">ID: {battle.id.split('_')[1]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold font-pixel text-sm">
                        <Trophy className="w-4 h-4" />
                        <span>{battle.prizePool} M</span>
                    </div>
                </div>

                <div className="space-y-6 mb-6">
                    <div className="flex justify-between items-center relative">
                        {/* VS Badge */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-primary/30 rounded-full p-1 z-10">
                            <Swords className="w-4 h-4 text-primary" />
                        </div>

                        <div className="flex flex-col items-center gap-2 w-1/2 pr-4 border-r border-primary/10">
                            <div className="w-10 h-10 border border-primary/30 flex items-center justify-center text-xs font-bold bg-primary/5">
                                {battle.playerA.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm truncate w-full text-center">{battle.playerA}</span>
                            {isActive && (
                                <span className={cn("font-mono text-xs", (battle.pnlA || 0) >= 0 ? "text-green-500" : "text-red-500")}>
                                    {(battle.pnlA || 0) > 0 ? '+' : ''}{battle.pnlA}%
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-2 w-1/2 pl-4">
                            {battle.playerB ? (
                                <>
                                    <div className="w-10 h-10 border border-secondary flex items-center justify-center text-xs font-bold bg-secondary/20">
                                        {battle.playerB.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-sm truncate w-full text-center">{battle.playerB}</span>
                                    {isActive && (
                                        <span className={cn("font-mono text-xs", (battle.pnlB || 0) >= 0 ? "text-green-500" : "text-red-500")}>
                                            {(battle.pnlB || 0) > 0 ? '+' : ''}{battle.pnlB}%
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 border border-dashed border-muted flex items-center justify-center text-xs text-muted-foreground">
                                        ?
                                    </div>
                                    <span className="text-muted-foreground text-xs italic">WAITING</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground font-mono mb-6 bg-secondary/20 p-2 border border-primary/10">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{battle.timeLeft || battle.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <Users className="w-3 h-3 text-primary" />
                        <span>ENTRY: {battle.entryFee} M</span>
                    </div>
                </div>

                <Link
                    to={`/battle/${battle.id}`}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 font-pixel text-xs transition-all clip-path-polygon hover:translate-x-1 hover:-translate-y-1",
                        isWaiting
                            ? "bg-primary text-black hover:bg-primary/90"
                            : "border border-primary/50 text-primary hover:bg-primary/10"
                    )}
                >
                    {isWaiting ? "JOIN_MATCH" : "SPECTATE"}
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
