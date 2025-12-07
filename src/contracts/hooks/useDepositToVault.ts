import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type Address, parseUnits } from "viem";
import { getMemeVaultConfig, CONTRACT_ADDRESSES } from "../config";
import { useVaultInfo } from "./useVaultInfo";
import { useTokenAllowance } from "./useTokenAllowance";
import { useApproveToken } from "./useApproveToken";

/**
 * Vault에 USDC 예치 (Deposit) - useWriteContract 사용
 * 
 * 5단계: approve → deposit 2단 구조의 두 번째 단계
 * 
 * 플로우:
 * 1. 필요시 approve (useApproveToken 사용)
 * 2. navPerShare 조회하여 minShares 계산
 * 3. issueWithBase 호출
 */
export function useDepositToVault() {
  const { address } = useAccount();
  const [vaultAddress, setVaultAddress] = useState<Address | undefined>();

  // Vault 정보 조회 (navPerShare 계산용)
  const { navPerShare, isLoading: isLoadingVaultInfo } = useVaultInfo(vaultAddress);

  // USDC 허용량 조회
  const { allowance, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: CONTRACT_ADDRESSES.USDC,
    ownerAddress: address,
    spenderAddress: vaultAddress,
    enabled: !!vaultAddress && !!address,
  });

  // Approve hook
  const {
    approveToken,
    isApproving,
    isConfirming: isConfirmingApprove,
    isApproved,
    reset: resetApprove,
  } = useApproveToken();

  // Deposit 트랜잭션
  const {
    writeContract: deposit,
    data: depositHash,
    isPending: isDepositing,
    error: depositError,
    reset: resetDeposit,
  } = useWriteContract();

  const {
    isLoading: isConfirmingDeposit,
    isSuccess: isDeposited,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  /**
   * USDC 예치 실행
   */
  const depositToVault = async ({
    vaultAddr,
    amount, // 예: "1000" = 1,000 USDC
    slippageBps = 500, // 기본값 5%
  }: {
    vaultAddr: Address;
    amount: string;
    slippageBps?: number;
  }) => {
    if (!address) {
      throw new Error("지갑이 연결되지 않았습니다.");
    }

    setVaultAddress(vaultAddr);

    const amountBN = parseUnits(amount, 6); // USDC는 6자리 소수점

    // 1. Allowance 확인 및 필요시 Approve
    const allowanceBN = allowance as bigint | undefined;
    if (!allowanceBN || allowanceBN < amountBN) {
      await approveToken({
        tokenAddress: CONTRACT_ADDRESSES.USDC,
        spenderAddress: vaultAddr,
      });
      // Approve 완료 대기
      // TODO: isApproved를 확인하는 로직 추가 필요
      await refetchAllowance();
    }

    // 2. navPerShare로 minShares 계산
    const navPerShareBN = navPerShare as bigint | undefined;
    if (!navPerShareBN) {
      throw new Error("Vault 정보를 불러올 수 없습니다.");
    }

    const expectedShares = (amountBN * BigInt(10 ** 18)) / navPerShareBN;
    const minShares = (expectedShares * BigInt(10_000 - slippageBps)) / BigInt(10_000);

    // 3. issueWithBase 호출
    const vaultConfig = getMemeVaultConfig(vaultAddr);
    deposit({
      ...vaultConfig,
      functionName: "issueWithBase",
      args: [amountBN, minShares, address, false], // payFeeWithCRT = false
    });
  };

  const reset = () => {
    resetApprove();
    resetDeposit();
    setVaultAddress(undefined);
  };

  return {
    depositToVault,
    depositHash,
    isApproving,
    isConfirmingApprove,
    isApproved,
    isDepositing,
    isConfirmingDeposit,
    isDeposited,
    isLoadingVaultInfo,
    error: depositError || receiptError,
    reset,
  };
}

