import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Wallet as WalletIcon } from "lucide-react";
import { useUserVaults } from "../../hooks/useUserVaults";
import type { VaultDetail } from "../../api/vault";

interface UserVaultListProps {
  addresses: string[];
}

function formatTvl(value: number): string {
  if (!Number.isFinite(value)) return "-";
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

function ProfileVaultCard({ vault }: { vault: VaultDetail }) {
  const overview = vault.strategy_description || vault.description || "";
  const shortOverview =
    overview.length > 120 ? `${overview.slice(0, 117)}...` : overview;

  const apy = vault.performance?.apy;
  const change = vault.performance?.change_24h;
  const changePositive = typeof change === "number" && change >= 0;

  const creatorAddress = vault.creator?.address ?? "";
  const creatorImage = vault.creator?.image_url ?? null;
  const truncatedCreator =
    creatorAddress && creatorAddress.length > 12
      ? `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`
      : creatorAddress;

  return (
    <div className="bg-card/60 border border-border rounded-lg p-6 hover:border-carrot-orange/60 hover:shadow-[0_0_30px_rgba(208,129,65,0.15)] transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-pixel text-carrot-orange mb-1 uppercase">
            Strategy
          </div>
          <h3 className="font-bold text-lg font-pixel text-white">
            {vault.name}
          </h3>
          <p className="text-xs text-muted-foreground font-tech mt-1">
            {shortOverview || "No strategy overview provided yet."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm mt-1">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase text-muted-foreground font-mono">
            Total Value Locked
          </span>
          <span className="font-mono text-sm text-white">
            {formatTvl(vault.tvl)}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase text-muted-foreground font-mono">
            Strategy APY
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-success flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {typeof apy === "number" ? `${apy.toFixed(2)}%` : "-"}
            </span>
            <span
              className={`text-[11px] font-mono ${
                typeof change === "number"
                  ? changePositive
                    ? "text-success"
                    : "text-error"
                  : "text-muted-foreground"
              }`}
            >
              {typeof change === "number"
                ? `${changePositive ? "+" : ""}${change.toFixed(2)}% 24h`
                : "– 24h"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-carrot-orange/10 flex items-center justify-center">
            {creatorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creatorImage}
                alt="Strategy creator"
                className="w-full h-full object-cover"
              />
            ) : (
              <WalletIcon className="w-4 h-4 text-carrot-orange" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted-foreground font-mono">
              Strategy Creator
            </span>
            <span className="text-xs font-mono text-white">
              {truncatedCreator || "Unknown"}
            </span>
          </div>
        </div>

        <Link
          to={`/vaults/${encodeURIComponent(vault.address)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-carrot-orange text-carrot-orange-foreground text-xs font-mono hover:bg-carrot-orange/90 transition-colors"
        >
          View Strategy
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export function UserVaultList({ addresses }: UserVaultListProps) {
  const { vaults, isLoading, isError, error } = useUserVaults(addresses);

  if (!addresses || addresses.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-sm text-muted-foreground font-tech bg-card/40">
        <p>No strategies yet.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg p-6 text-sm text-muted-foreground font-mono bg-card/40">
        Loading strategies...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-lg p-6 text-sm font-mono">
        Failed to load strategies for this profile.
        {error instanceof Error && (
          <span className="block text-xs mt-1 opacity-80">
            {error.message}
          </span>
        )}
      </div>
    );
  }

  if (!vaults.length) {
    return (
      <div className="border border-dashed border-border rounded-lg p-6 text-sm text-muted-foreground font-tech bg-card/40">
        <p>No strategies yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vaults.map((vault) => (
        <ProfileVaultCard key={vault.address} vault={vault} />
      ))}
    </div>
  );
}


