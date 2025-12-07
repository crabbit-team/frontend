import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { type Address, parseEther, parseUnits, decodeEventLog } from "viem";
import { CONTRACT_CONFIGS, CONTRACT_ADDRESSES } from "../config";
import { useApproveToken } from "./useApproveToken";
import { useTokenAllowance } from "./useTokenAllowance";
import MemeVaultFactoryABI from "../abi/MemeVaultFactory.json";

/**
 * Vault 생성 (Create Vault) - useWriteContract 사용
 * 
 * 플로우:
 * 1. CRT 토큰 승인 (1,000 CRT)
 * 2. 포트폴리오 토큰들 승인
 * 3. createVault 호출
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
   * Vault 생성 실행
   */
  const createVaultWithParams = async ({
    name,
    symbol,
    description,
    portfolioTokens: tokens, // { address, amount, decimals }[]
  }: {
    name: string;
    symbol: string;
    description: string;
    portfolioTokens: { address: Address; amount: string; decimals: number }[]; // amount는 문자열, decimals는 토큰의 소수점 자릿수
  }) => {
    if (!address) {
      throw new Error("지갑이 연결되지 않았습니다.");
    }

    // 포트폴리오 토큰들을 BigInt로 변환 (각 토큰의 decimals 사용)
    const tokensWithBigInt = tokens.map((token) => ({
      address: token.address,
      amount: parseUnits(token.amount, token.decimals), // 각 토큰의 decimals 사용
    }));


    // 1. CRT 토큰 승인 (1,000 CRT)
    const createFee = parseEther("1000");
    const crtAllowanceBN = crtAllowance as bigint | undefined;
    if (!crtAllowanceBN || crtAllowanceBN < createFee) {
      approveToken({
        tokenAddress: CONTRACT_ADDRESSES.CrtToken,
        spenderAddress: CONTRACT_ADDRESSES.MemeVaultFactory,
        amount: createFee,
      });
      // approve 완료 대기 (isApproved 확인 필요)
      // TODO: isApproved를 확인하는 로직 추가 필요
      await refetchCrtAllowance();
    }

    // 2. 포트폴리오 토큰들 승인 (각 토큰별로)
    // 각 토큰에 대해 allowance 확인 및 승인
    // Note: useTokenAllowance는 hook이므로 반복문 안에서 직접 사용할 수 없음
    // 대신 각 토큰에 대해 순차적으로 approve 처리
    // 실제로는 컨트랙트에서 이미 승인된 경우를 처리하므로, 여기서는 일단 승인만 시도
    // TODO: 각 토큰의 allowance를 확인하는 로직 추가 (useReadContract 사용)

    // 3. createVault 호출
    // ABI에 따르면 createVault는 (name, symbol, baseAsset, priceOracle, description, imageURI, portfolioTokens, amounts) 순서
    createVault({
      ...CONTRACT_CONFIGS.MemeVaultFactory,
      functionName: "createVault",
      args: [
        name,
        symbol,
        CONTRACT_ADDRESSES.USDC, // baseAsset
        CONTRACT_ADDRESSES.UniswapV3TWAPOracle, // priceOracle
        description,
        "", // imageURI (빈 문자열)
        tokensWithBigInt.map((t) => t.address), // portfolioTokens
        tokensWithBigInt.map((t) => t.amount), // amounts
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

