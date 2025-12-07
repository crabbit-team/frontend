import { useReadContract } from "wagmi";
import { type Address } from "viem";
import { CONTRACT_CONFIGS } from "../contracts/config";

/**
 * ERC-20 토큰 잔액 조회 (useReadContract 사용)
 */
export function useTokenBalance({
  tokenAddress,
  userAddress,
  enabled = true,
}: {
  tokenAddress: Address | undefined;
  userAddress: Address | undefined;
  enabled?: boolean;
}) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: CONTRACT_CONFIGS.DemoUSDC.abi, // ERC-20 표준 ABI
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: enabled && !!tokenAddress && !!userAddress,
    },
  });

  return {
    balance: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

