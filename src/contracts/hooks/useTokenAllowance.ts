import { useReadContract } from "wagmi";
import { type Address } from "viem";
import { CONTRACT_CONFIGS } from "../config";

/**
 * ERC-20 토큰 허용량(allowance) 조회 (useReadContract 사용)
 */
export function useTokenAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  enabled = true,
}: {
  tokenAddress: Address | undefined;
  ownerAddress: Address | undefined;
  spenderAddress: Address | undefined;
  enabled?: boolean;
}) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_CONFIGS.DemoUSDC.abi, // ERC-20 표준 ABI
    functionName: "allowance",
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: {
      enabled: enabled && !!tokenAddress && !!ownerAddress && !!spenderAddress,
    },
  });

  return {
    allowance: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

