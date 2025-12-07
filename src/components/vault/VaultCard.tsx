import { Link } from "react-router-dom";
import type { VaultSummary } from "../../api/vault";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";

interface VaultCardProps {
    vault: VaultSummary;
}

export function VaultCard({ vault }: VaultCardProps) {
    const apy = vault.performance?.apy ?? 0;
    // TVL: "00000.00" 형식의 문자열로 오므로 파싱해서 표시
    const tvl = parseFloat(vault.tvl);

    return (
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg">{vault.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {vault.creator?.address ? `${vault.creator.address.slice(0, 6)}...${vault.creator.address.slice(-4)}` : "Unknown"}
                    </p>
                </div>
                <div className="bg-success/10 text-success px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {apy.toFixed(2)}% APY
                </div>
            </div>

            <div className="flex items-center justify-between text-sm mb-6">
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">${tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TVL</span>
                </div>
                <div className="flex gap-1">
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                        Tier: {vault.tier}
                    </span>
                </div>
            </div>

            <Link
                to={`/vaults/${vault.address}`}
                className="w-full bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-colors"
            >
                View Strategy
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
