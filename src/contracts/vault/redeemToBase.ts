import { ethers, type BigNumberish } from "ethers";
import MemeVaultABI from "../abi/MemeVault.json";
import { getSigner } from "../ethersClient";

export interface RedeemToBaseParams {
  vaultAddress: string;
  shareAmount: BigNumberish; // 지분 단위 (18자리 소수점)
  slippageBps?: number; // 기본값 500 (5%)
}

/**
 * 플로우 3: USDC로 인출 (투자자)
 * 
 * 개요:
 * 1. redeemToBase() 호출
 * 2. USDC 수령!
 */
export async function redeemToBase(params: RedeemToBaseParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const vault = new ethers.Contract(params.vaultAddress, MemeVaultABI.abi, signer);

  // 슬리피지 보호된 최소 USDC를 위한 현재 가치 읽기
  const totalValue = await vault.getTotalValue();
  const totalSupply = await vault.totalSupply();

  const shareBN = ethers.BigNumber.from(params.shareAmount);
  const shareValue = shareBN.mul(totalValue).div(totalSupply);

  const slippageBps = params.slippageBps ?? 500;
  const minUSDC = shareValue.mul(10_000 - slippageBps).div(10_000);

  // payFeeWithCRT = false로 redeemToBase 호출 (USDC로 수수료 지불)
  const payFeeWithCRT = false;
  const tx = await vault.redeemToBase(shareBN, minUSDC, userAddress, payFeeWithCRT);
  const receipt = await tx.wait();

  const event = receipt.events?.find((e: any) => e.event === "RedeemToBase");
  const usdcReceived = event?.args?.baseReceived as BigNumberish | undefined;

  return {
    tx,
    receipt,
    usdcReceived,
  };
}

