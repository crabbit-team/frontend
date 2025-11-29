import { VaultCard } from "../components/vault/VaultCard";
import { MOCK_VAULTS } from "../lib/mockData";

export function Vaults() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Strategy Vaults</h1>
                    <p className="text-muted-foreground">
                        Browse curated meme and crypto strategies. Click a vault to view details and performance.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_VAULTS.map((vault) => (
                    <VaultCard key={vault.id} vault={vault} />
                ))}
            </div>
        </div>
    );
}


