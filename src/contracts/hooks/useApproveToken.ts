import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type Address, maxUint256 } from "viem";
import { CONTRACT_CONFIGS } from "../config";

/**
 * ERC-20 토큰 승인 (Approve) - useWriteContract 사용
 * 
 * 5단계: approve → deposit 2단 구조의 첫 번째 단계
 */
export function useApproveToken() {
  const [approvingToken, setApprovingToken] = useState<Address | null>(null);
  const [approvingSpender, setApprovingSpender] = useState<Address | null>(null);

  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApproving,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isApproved,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const approveToken = async ({
    tokenAddress,
    spenderAddress,
    amount = maxUint256, // 기본값: 무제한 승인
  }: {
    tokenAddress: Address;
    spenderAddress: Address;
    amount?: bigint;
  }) => {
    setApprovingToken(tokenAddress);
    setApprovingSpender(spenderAddress);

    approve({
      address: tokenAddress,
      abi: CONTRACT_CONFIGS.DemoUSDC.abi, // ERC-20 표준 ABI
      functionName: "approve",
      args: [spenderAddress, amount],
    });
  };

  const reset = () => {
    resetApprove();
    setApprovingToken(null);
    setApprovingSpender(null);
  };

  return {
    approveToken,
    approveHash,
    isApproving,
    isConfirming,
    isApproved,
    error: approveError || receiptError,
    reset,
    approvingToken,
    approvingSpender,
  };
}

