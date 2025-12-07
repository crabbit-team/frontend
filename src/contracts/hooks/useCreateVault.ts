import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type Address, parseEther, parseUnits, decodeEventLog } from "viem";
import { CONTRACT_CONFIGS, CONTRACT_ADDRESSES } from "../config";
import { useApproveToken } from "./useApproveToken";
import { useTokenAllowance } from "./useTokenAllowance";
import MemeVaultFactoryABI from "../abi/MemeVaultFactory.json";

/**
 * Vault 생성 (Create Vault with Base) - useWriteContract 사용
 *
 * 플로우:
 * 1. CRT 토큰 승인 (1,000 CRT)
 * 2. USDC 승인
 * 3. createVaultWithBase 호출 (USDC로 포트폴리오 토큰 자동 구매)
 */
export function useCreateVault() {
  const { address } = useAccount();

  // CRT 토큰 허용량 조회
  const { allowance: crtAllowance, refetch: refetchCrtAllowance } =
    useTokenAllowance({
      tokenAddress: CONTRACT_ADDRESSES.CrtToken,
      ownerAddress: address,
      spenderAddress: CONTRACT_ADDRESSES.MemeVaultFactory,
      enabled: !!address,
    });

  // Approve hook
  const {
    approveToken,
    isApproving,
    isConfirming: isConfirmingApprove,
    isApproved,
    reset: resetApprove,
  } = useApproveToken();

  // CreateVault 트랜잭션
  const {
    writeContract: createVault,
    data: createVaultHash,
    isPending: isCreating,
    error: createVaultError,
    reset: resetCreateVault,
  } = useWriteContract();

  const {
    isLoading: isConfirmingCreate,
    isSuccess: isCreated,
    data: receipt,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: createVaultHash,
  });

  // VaultCreated 이벤트에서 vault 주소 추출
  const [vaultAddress, setVaultAddress] = useState<Address | undefined>();

  useEffect(() => {
    if (receipt?.logs) {
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: MemeVaultFactoryABI.abi,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "VaultCreated" && decoded.args && "vault" in decoded.args) {
            setVaultAddress(decoded.args.vault as Address);
            break;
          }
        } catch {
          // 이 로그는 VaultCreated 이벤트가 아님
          continue;
        }
      }
    }
  }, [receipt]);

  /**
   * Vault 생성 실행 (createVaultWithBase 사용)
   */
  const createVaultWithParams = async ({
    name,
    symbol,
    description,
    imageURI,
    baseAmount, // USDC amount
    portfolioTokens: tokens, // { address, weightBps }[]
  }: {
    name: string;
    symbol: string;
    description: string;
    imageURI?: string; // 전략 이미지 URL
    baseAmount: string; // USDC 금액 (예: "1000")
    portfolioTokens: { address: Address; weightBps: number }[]; // weightBps: 가중치 (총합 10000)
  }) => {
    if (!address) {
      throw new Error("지갑이 연결되지 않았습니다.");
    }

    // 가중치 총합 검증
    const totalWeight = tokens.reduce((sum, t) => sum + t.weightBps, 0);
    if (totalWeight !== 10000) {
      throw new Error(`포트폴리오 가중치 총합은 10000이어야 합니다. 현재: ${totalWeight}`);
    }

    // 1. CRT 토큰 승인 (1,000 CRT)
    const createFee = parseEther("1000");
    const crtAllowanceBN = crtAllowance as bigint | undefined;
    if (!crtAllowanceBN || crtAllowanceBN < createFee) {
      approveToken({
        tokenAddress: CONTRACT_ADDRESSES.CrtToken,
        spenderAddress: CONTRACT_ADDRESSES.MemeVaultFactory,
        amount: createFee,
      });
      await refetchCrtAllowance();
    }

    // 2. USDC 승인
    const baseAmountBN = parseUnits(baseAmount, 6); // USDC는 6 decimals
    approveToken({
      tokenAddress: CONTRACT_ADDRESSES.USDC,
      spenderAddress: CONTRACT_ADDRESSES.MemeVaultFactory,
      amount: baseAmountBN,
    });

    // 3. createVaultWithBase 호출
    // ABI에 따르면 createVaultWithBase는 (name, symbol, baseAsset, priceOracle, description, imageURI, baseAmount, portfolioTokens, targetWeightsBps) 순서
    createVault({
      ...CONTRACT_CONFIGS.MemeVaultFactory,
      functionName: "createVaultWithBase",
      args: [
        name,
        symbol,
        CONTRACT_ADDRESSES.USDC, // baseAsset
        CONTRACT_ADDRESSES.UniswapV3TWAPOracle, // priceOracle
        description,
        imageURI || "", // imageURI
        baseAmountBN, // baseAmount (USDC)
        tokens.map((t) => t.address), // portfolioTokens
        tokens.map((t) => t.weightBps), // targetWeightsBps
      ],
    });
  };

  const reset = () => {
    resetApprove();
    resetCreateVault();
    setVaultAddress(undefined);
  };

  return {
    createVaultWithParams,
    createVaultHash,
    isApproving,
    isConfirmingApprove,
    isApproved,
    isCreating,
    isConfirmingCreate,
    isCreated,
    vaultAddress, // 생성된 vault 주소
    error: createVaultError || receiptError,
    reset,
  };
}

