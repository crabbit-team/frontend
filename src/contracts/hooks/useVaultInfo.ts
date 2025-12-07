import { useReadContract } from "wagmi";
import { type Address } from "viem";
import { getMemeVaultConfig } from "../config";

/**
 * Vault 정보 조회 (useReadContract 사용)
 */
export function useVaultInfo(vaultAddress: Address | undefined) {
  const vaultConfig = vaultAddress ? getMemeVaultConfig(vaultAddress) : undefined;

  // NAV per share 조회
  const {
    data: navPerShare,
    isLoading: isLoadingNav,
    isError: isErrorNav,
    error: errorNav,
  } = useReadContract({
    ...vaultConfig,
    functionName: "navPerShare",
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Total value 조회
  const {
    data: totalValue,
    isLoading: isLoadingTotalValue,
    isError: isErrorTotalValue,
    error: errorTotalValue,
  } = useReadContract({
    ...vaultConfig,
    functionName: "getTotalValue",
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Total supply 조회
  const {
    data: totalSupply,
    isLoading: isLoadingSupply,
    isError: isErrorSupply,
    error: errorSupply,
  } = useReadContract({
    ...vaultConfig,
    functionName: "totalSupply",
    query: {
      enabled: !!vaultAddress,
    },
  });

  return {
    navPerShare,
    totalValue,
    totalSupply,
    isLoading: isLoadingNav || isLoadingTotalValue || isLoadingSupply,
    isError: isErrorNav || isErrorTotalValue || isErrorSupply,
    error: errorNav || errorTotalValue || errorSupply,
  };
}

