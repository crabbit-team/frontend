import { ethers, type BigNumberish } from "ethers";
import MemeVaultFactoryABI from "../abi/MemeVaultFactory.json";
import CrtTokenABI from "../abi/CrtToken.json";
import { CONTRACTS } from "../contracts";
import { getSigner } from "../ethersClient";

export interface CreateVaultParams {
  name: string;
  symbol: string;
  baseAsset?: string; // 기본값: CONTRACTS.USDC
  priceOracle?: string; // 기본값: CONTRACTS.UniswapV3TWAPOracle
  managementFeeBps: number; // 예: 200 = 2%
  performanceFeeBps: number; // 예: 2000 = 20%
  description: string;
  portfolioTokens: { address: string; amount: BigNumberish }[];
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
 * 플로우 1: Vault 생성 (매니저)
 * 
 * 개요:
 * 1. CRT 토큰 승인 (1,000 CRT 수수료)
 * 2. 초기 포트폴리오 토큰들 승인
 * 3. createVault() 호출
 * 4. 매니저 NFT 수령!
 */
export async function createVault(params: CreateVaultParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const crtTokenAddr = assertAddress("MemeToken");
  const factoryAddr = assertAddress("MemeVaultFactory");
  const usdcAddr = params.baseAsset ?? assertAddress("USDC");
  const oracleAddr = params.priceOracle ?? assertAddress("UniswapV3TWAPOracle");

  // ========== 단계 1: CRT 토큰 승인 ==========
  console.log("Step 1: Approving CRT tokens...");
  const crtToken = new ethers.Contract(crtTokenAddr, CrtTokenABI.abi, signer);
  const createFee = ethers.utils.parseEther("1000"); // 1,000 CRT
  const approveTx1 = await crtToken.approve(factoryAddr, createFee);
  await approveTx1.wait();
  console.log("CRT approved!");

  // ========== 단계 2: 포트폴리오 토큰들 승인 ==========
  console.log("Step 2: Approving portfolio tokens...");
  for (const token of params.portfolioTokens) {
    const tokenContract = new ethers.Contract(
      token.address,
      ["function approve(address,uint256) returns (bool)"],
      signer,
    );
    const tx = await tokenContract.approve(factoryAddr, token.amount);
    await tx.wait();
    console.log(`${token.address} approved!`);
  }

  // ========== 단계 3: Vault 생성 ==========
  console.log("Step 3: Creating vault...");
  const factory = new ethers.Contract(factoryAddr, MemeVaultFactoryABI.abi, signer);

  const tx = await factory.createVault(
    params.name,                                    // name: Vault 이름
    params.symbol,                                  // symbol: 토큰 심볼
    usdcAddr,                                      // baseAsset: 기본 자산 (USDC)
    oracleAddr,                                    // priceOracle: 가격 오라클
    params.managementFeeBps,                       // managementFeeBps: 예: 200 = 2%
    params.performanceFeeBps,                      // performanceFeeBps: 예: 2000 = 20%
    params.description,                            // description: 설명
    params.portfolioTokens.map((t) => t.address), // portfolioTokens: 토큰 주소 배열
    params.portfolioTokens.map((t) => t.amount),   // amounts: 수량 배열
  );

  const receipt = await tx.wait();
  
  // 이벤트에서 vault 주소 추출
  const event = receipt.events?.find((e: any) => e.event === "VaultCreated");
  const vaultAddress: string | undefined = event?.args?.vault;
  
  console.log("Vault created!");
  console.log("Vault address:", vaultAddress);

  return {
    tx,
    receipt,
    vaultAddress,
    manager: userAddress,
  };
}

