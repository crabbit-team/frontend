import { Link } from "react-router-dom";
import { Users, Clock, Trophy, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { VaultSummary } from "../../api/vault";
import type { BattleStatus } from "../../api/battle";

interface BattleCardProps {
  strategy: VaultSummary;
  status: BattleStatus;
  prizePool?: number; // CRT
  entryFee?: number; // CRT
  durationLabel?: string; // e.g. "10m"
  timeLeftLabel?: string; // e.g. "45:20"
  href?: string; // optional link target
}

export function BattleCard({
  strategy,
  status,
  prizePool,
  entryFee,
  durationLabel,
  timeLeftLabel,
  href,
}: BattleCardProps) {
  const isWaiting = status === "WAITING";
  const isActive = status === "IN_PROGRESS" || status === "RUNNING";
  const statusLabel = status;

  const displayApy =
    typeof strategy.performance?.apy === "number"
      ? `${strategy.performance.apy.toFixed(2)}% APY`
      : "-";

  const displayChange =
    typeof strategy.performance?.change_24h === "number"
      ? `${strategy.performance.change_24h >= 0 ? "+" : ""}${strategy.performance.change_24h.toFixed(2)}% 24h`
      : "– 24h";

  const shortCreator =
    strategy.creator?.address && strategy.creator.address.length > 12
      ? `${strategy.creator.address.slice(0, 6)}...${strategy.creator.address.slice(-4)}`
      : strategy.creator?.address ?? "Unknown";

  const tvlLabel =
    typeof strategy.tvl === "number"
      ? `$${strategy.tvl.toLocaleString()} TVL`
      : "TVL –";

  const timeLabel = timeLeftLabel || durationLabel || "-";

  return (
    <div className="group bg-card/50 border border-carrot-orange/20 hover:border-carrot-orange transition-all hover:shadow-[0_0_20px_rgba(208,129,65,0.1)] relative overflow-hidden">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-carrot-orange/10 clip-path-polygon" />

      <div className="p-6 space-y-5">
        {/* Status + Prize */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-1 text-[10px] font-pixel uppercase tracking-wider border",
                isWaiting
                  ? "border-warning/50 text-warning bg-warning/10"
                  : isActive
                    ? "border-success/50 text-success bg-success/10 animate-pulse"
                    : "border-gray/50 text-gray bg-gray/10",
              )}
            >
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-carrot-orange font-bold font-pixel text-sm">
            <Trophy className="w-4 h-4" />
            <span>{prizePool != null ? `${prizePool} CRT` : "--"}</span>
          </div>
        </div>

        {/* Strategy summary */}
        <div className="space-y-2">
          <div className="text-[11px] font-pixel text-carrot-orange uppercase">
            Strategy
          </div>
          <h3 className="font-bold text-lg font-pixel text-white truncate">
            {strategy.name}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
            <span>Creator: {shortCreator}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{tvlLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-success">{displayApy}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-xs text-muted-foreground">{displayChange}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground font-mono bg-secondary/20 p-2 border border-carrot-orange/10 rounded">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-carrot-orange" />
            <span>{timeLabel}</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Users className="w-3 h-3 text-carrot-orange" />
            <span>
              ENTRY: {entryFee != null ? `${entryFee} CRT` : "--"}
            </span>
          </div>
        </div>

        {/* Action */}
        {href ? (
          <Link
            to={href}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 font-pixel text-xs transition-all clip-path-polygon hover:translate-x-1 hover:-translate-y-1",
              isWaiting
                ? "bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90"
                : "border border-carrot-orange/50 text-carrot-orange hover:bg-carrot-orange/10",
            )}
          >
            {isWaiting ? "JOIN_STRATEGY_BATTLE" : "VIEW_STRATEGY"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <div
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 font-pixel text-xs transition-all clip-path-polygon border border-dashed border-carrot-orange/40 text-carrot-orange/70 cursor-default",
            )}
          >
            {isWaiting ? "READY_TO_MATCH" : "STRATEGY_SUMMARY"}
          </div>
        )}
      </div>
    </div>
  );
}
