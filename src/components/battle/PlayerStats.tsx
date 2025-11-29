import { cn } from "../../lib/utils";

interface PlayerStatsProps {
    name: string;
    pnl: number;
    equity: number;
    isOpponent?: boolean;
}

export function PlayerStats({ name, pnl, equity, isOpponent }: PlayerStatsProps) {
    return (
        <div className={cn(
            "bg-card border border-border rounded-lg p-4 flex flex-col",
            isOpponent ? "items-end text-right" : "items-start text-left"
        )}>
            <div className="flex items-center gap-2 mb-2">
                {!isOpponent && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                        {name.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <span className="font-bold text-lg">{name}</span>
                {isOpponent && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                        {name.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className={cn("text-2xl font-bold", pnl >= 0 ? "text-green-600" : "text-red-600")}>
                    {pnl > 0 ? '+' : ''}{pnl}%
                </div>
                <div className="text-sm text-muted-foreground">
                    Equity: ${equity.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
