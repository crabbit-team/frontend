import { useState, useEffect } from "react";
import type { Vault } from "../lib/mockData";
import { MOCK_VAULTS } from "../lib/mockData";

interface UseMockVaultResult {
  vault: Vault | null;
  loading: boolean;
  error: string | null;
}

// NOTE: 실제 API 가 아니라, 로컬 MOCK 데이터를 읽는 훅이라서 useMockVault 라고 명시.
export function useMockVault(vaultId: string | undefined): UseMockVaultResult {
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!vaultId) {
          throw new Error("Vault ID is required");
        }

        const foundVault = MOCK_VAULTS.find((v) => v.id === vaultId);

        if (!foundVault) {
          throw new Error("Vault not found");
        }

        setVault(foundVault);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setVault(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchVault();
  }, [vaultId]);

  return { vault, loading, error };
}



