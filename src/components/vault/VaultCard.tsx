import { Link } from "react-router-dom";
import type { Vault } from "../../lib/mockData";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";

interface VaultCardProps {
    vault: Vault;
}

export function VaultCard({ vault }: VaultCardProps) {
    return (
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">{vault.name}</h3>
                    <p className="text-sm text-muted-foreground">by {vault.manager}</p>
                </div>
                <div className="bg-success/10 text-success px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {vault.apy}% APY
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {vault.description}
            </p>

            <div className="flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">${vault.tvl.toLocaleString()} TVL</span>
                </div>
                <div className="flex gap-1">
                    {vault.holdings.slice(0, 3).map(h => (
                        <span key={h.token} className="bg-secondary px-2 py-0.5 rounded text-xs">
                            {h.token}
                        </span>
                    ))}
                </div>
            </div>

            <Link
                to={`/vaults/${vault.id}`}
                className="w-full bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors"
            >
                View Strategy
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
