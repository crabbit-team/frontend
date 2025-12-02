import { useQuery } from "@tanstack/react-query";
import { getVaultByAddress, type VaultDetail } from "../api/vault";

interface UseVaultsResult {
  vaults: VaultDetail[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

// NOTE: API 상의 vault 여러 개를 가져오지만,
// 이 데이터를 UI 단에서는 Strategy Deck 으로 보여준다.
export function useUserVaults(
  addresses: string[] | undefined,
): UseVaultsResult {
  const enabled = !!addresses && addresses.length > 0;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile-strategies", addresses],
    enabled,
    queryFn: async () => {
      if (!addresses || addresses.length === 0) return [];

      const results = await Promise.all(
        addresses.map(async (address) => {
          try {
            const vault = await getVaultByAddress(address);
            return { vault, error: null as unknown };
          } catch (err) {
            console.error("Failed to fetch vault", address, err);
            return { vault: null as VaultDetail | null, error: err };
          }
        }),
      );

      const vaults = results
        .filter((r) => r.vault !== null)
        .map((r) => r.vault as VaultDetail);

      const hasAnyError = results.some((r) => r.error != null);
      const hasAnySuccess = vaults.length > 0;

      // If every request failed, surface an error so UI can show an error state.
      if (!hasAnySuccess && hasAnyError) {
        throw new Error("Failed to load vaults for this profile.");
      }

      return vaults;
    },
  });

  return {
    vaults: data ?? [],
    isLoading: enabled && isLoading,
    isError: enabled && isError,
    error,
  };
}



