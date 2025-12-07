import { ethers } from "ethers";
import MemeVaultABI from "../abi/MemeVault.json";
import DemoUSDCABI from "../abi/DemoUSDC.json";
import { CONTRACTS } from "../contracts";
import { getSigner, getReadOnlyProvider } from "../ethersClient";

export interface IssueWithBaseParams {
  vaultAddress: string;
  usdcAmount: number; // 예: 1000 = 1,000 USDC
  slippageBps?: number; // 기본값: 500 (5%)
}

// 헬퍼 함수: 쓰기 함수 호출 전 컨트랙트 주소가 설정되어 있는지 확인
function assertAddress(name: keyof typeof CONTRACTS) {
  const addr = CONTRACTS[name];
  if (!addr || addr === "0x0000000000000000000000000000000000000000") {
    throw new Error(`Contract address for ${name} is not configured.`);
  }
  return addr;
}

/**
 * 플로우 2: USDC로 투자 (투자자)
 * 
 * 개요:
 * 1. Vault에 USDC 승인
 * 2. issueWithBase() 호출
 * 3. Vault 지분 수령!
 */
export async function issueWithBase(params: IssueWithBaseParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const usdcAddr = assertAddress("USDC");
  const amount = ethers.utils.parseUnits(params.usdcAmount.toString(), 6); // USDC는 6자리 소수점

  // 0) USDC 잔액 확인
  const usdc = new ethers.Contract(usdcAddr, DemoUSDCABI.abi, signer);
  const balance = await usdc.balanceOf(userAddress);
  if (balance.lt(amount)) {
    throw new Error(`Insufficient USDC balance. Required: ${ethers.utils.formatUnits(amount, 6)}, Available: ${ethers.utils.formatUnits(balance, 6)}`);
  }

  // 1) 현재 허용량 확인
  const currentAllowance = await usdc.allowance(userAddress, params.vaultAddress);
  
  // 2) 필요시 Vault에 USDC 승인
  if (currentAllowance.lt(amount)) {
    // 반복 승인을 피하기 위해 더 큰 금액 승인
    const approveAmount = ethers.constants.MaxUint256;
    const approveTx = await usdc.approve(params.vaultAddress, approveAmount);
    await approveTx.wait();
  }

  // 3) 슬리피지 보호된 최소 지분 계산
  const vaultRead = new ethers.Contract(
    params.vaultAddress,
    MemeVaultABI.abi,
    getReadOnlyProvider(),
  );
  const navPerShare = await vaultRead.navPerShare();
  const expectedShares = amount
    .mul(ethers.utils.parseEther("1"))
    .div(navPerShare);

  const slippageBps = params.slippageBps ?? 500; // 기본값 5%
  const minShares = expectedShares.mul(10_000 - slippageBps).div(10_000);

  // 4) Vault에서 issueWithBase 호출
  // issueWithBase(baseAmount, minShares, receiver, payFeeWithCRT)
  const vault = new ethers.Contract(params.vaultAddress, MemeVaultABI.abi, signer);
  const payFeeWithCRT = false; // 기본적으로 USDC로 수수료 지불
  const tx = await vault.issueWithBase(amount, minShares, userAddress, payFeeWithCRT);
  const receipt = await tx.wait();

  // 5) 이벤트에서 수령한 지분 파싱
  const event = receipt.events?.find((e: any) => e.event === "IssueWithBase");
  const sharesReceived = event?.args?.shares as ethers.BigNumber | undefined;

  return {
    tx,
    receipt,
    sharesReceived,
  };
}

