import { useState, useEffect } from 'react';
import type { Vault } from '../data/mockVaults';
import { MOCK_VAULTS } from '../data/mockVaults';

interface UseVaultResult {
    vault: Vault | null;
    loading: boolean;
    error: string | null;
}

export function useVault(vaultId: string | undefined): UseVaultResult {
    const [vault, setVault] = useState<Vault | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate API call
        const fetchVault = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                if (!vaultId) {
                    throw new Error("Vault ID is required");
                }

                const foundVault = MOCK_VAULTS.find(v => v.id === vaultId);

                if (!foundVault) {
                    throw new Error("Vault not found");
                }

                setVault(foundVault);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setVault(null);
            } finally {
                setLoading(false);
            }
        };

        fetchVault();
    }, [vaultId]);

    return { vault, loading, error };
}
