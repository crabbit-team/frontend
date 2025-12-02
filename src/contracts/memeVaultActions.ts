import { ethers, type BigNumberish } from "ethers";
import MemeVaultABI from "../abi/MemeVault.json";
import MemeVaultFactoryABI from "../abi/MemeVaultFactory.json";
import MemeTokenABI from "../abi/MemeToken.json";
import { CONTRACTS } from "./contracts";
import { getSigner, getReadOnlyProvider } from "./ethersClient";

// Helper: ensure contracts are configured before calling write functions
function assertAddress(name: keyof typeof CONTRACTS) {
  const addr = CONTRACTS[name];
  if (!addr || addr === "0x0000000000000000000000000000000000000000") {
    throw new Error(`Contract address for ${name} is not configured.`);
  }
  return addr;
}

// === Flow 1: Create Vault (Manager) ======================================

export interface CreateVaultParams {
  name: string;
  symbol: string;
  baseAsset?: string; // defaults to CONTRACTS.USDC
  priceOracle?: string; // defaults to CONTRACTS.UniswapV3TWAPOracle
  managementFeeBps: number; // e.g. 200 = 2%
  performanceFeeBps: number; // e.g. 2000 = 20%
  description: string;
  portfolioTokens: { address: string; amount: BigNumberish }[];
}

export async function createVault(params: CreateVaultParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const memeTokenAddr = assertAddress("MemeToken");
  const factoryAddr = assertAddress("MemeVaultFactory");
  const usdcAddr = params.baseAsset ?? assertAddress("USDC");
  const oracleAddr = params.priceOracle ?? assertAddress("UniswapV3TWAPOracle");

  // 1) Approve CRT create fee
  const crtToken = new ethers.Contract(memeTokenAddr, MemeTokenABI, signer);
  const createFee = ethers.utils.parseEther("1000"); // 1,000 CRT
  const approveFeeTx = await crtToken.approve(factoryAddr, createFee);
  await approveFeeTx.wait();

  // 2) Approve portfolio tokens
  for (const token of params.portfolioTokens) {
    const tokenContract = new ethers.Contract(
      token.address,
      ["function approve(address,uint256) returns (bool)"],
      signer,
    );
    const tx = await tokenContract.approve(factoryAddr, token.amount);
    await tx.wait();
  }

  // 3) Call createVault on factory
  const factory = new ethers.Contract(factoryAddr, MemeVaultFactoryABI, signer);

  const tx = await factory.createVault(
    params.name,
    params.symbol,
    usdcAddr,
    oracleAddr,
    params.managementFeeBps,
    params.performanceFeeBps,
    params.description,
    params.portfolioTokens.map((t) => t.address),
    params.portfolioTokens.map((t) => t.amount),
  );

  const receipt = await tx.wait();
  const event = receipt.events?.find((e: any) => e.event === "VaultCreated");
  const vaultAddress: string | undefined = event?.args?.vault;

  return {
    tx,
    receipt,
    vaultAddress,
    manager: userAddress,
  };
}

// === Flow 2: Invest with USDC (Investor) =================================

export interface InvestWithUSDCParams {
  vaultAddress: string;
  usdcAmount: number; // e.g. 1000 = 1,000 USDC
  slippageBps?: number; // default: 500 (5%)
}

export async function investWithUSDC(params: InvestWithUSDCParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const usdcAddr = assertAddress("USDC");
  const amount = ethers.utils.parseUnits(params.usdcAmount.toString(), 6); // USDC has 6 decimals

  // 1) Approve USDC to vault
  const usdc = new ethers.Contract(
    usdcAddr,
    ["function approve(address,uint256) returns (bool)"],
    signer,
  );
  const approveTx = await usdc.approve(params.vaultAddress, amount);
  await approveTx.wait();

  // 2) Compute optional slippage-protected minShares
  const vaultRead = new ethers.Contract(
    params.vaultAddress,
    MemeVaultABI,
    getReadOnlyProvider(),
  );
  const navPerShare = await vaultRead.navPerShare();
  const expectedShares = amount
    .mul(ethers.utils.parseEther("1"))
    .div(navPerShare);

  const slippageBps = params.slippageBps ?? 500; // 5% default
  const minShares = expectedShares.mul(10_000 - slippageBps).div(10_000);

  // 3) Call issueWithBase on vault
  const vault = new ethers.Contract(params.vaultAddress, MemeVaultABI, signer);
  const tx = await vault.issueWithBase(amount, minShares, userAddress);
  const receipt = await tx.wait();

  const event = receipt.events?.find((e: any) => e.event === "IssueWithBase");
  const sharesReceived = event?.args?.sharesMinted as BigNumberish | undefined;

  return {
    tx,
    receipt,
    sharesReceived,
  };
}

// === Flow 3: Withdraw to USDC (Investor) =================================

export interface WithdrawToUSDCParams {
  vaultAddress: string;
  shareAmount: BigNumberish; // in share units (18 decimals)
  slippageBps?: number; // default 500 (5%)
}

export async function withdrawToUSDC(params: WithdrawToUSDCParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const vault = new ethers.Contract(params.vaultAddress, MemeVaultABI, signer);

  // Read current value for slippage-protected minUSDC
  const totalValue = await vault.getTotalValue();
  const totalSupply = await vault.totalSupply();

  const shareBN = ethers.BigNumber.from(params.shareAmount);
  const shareValue = shareBN.mul(totalValue).div(totalSupply);

  const slippageBps = params.slippageBps ?? 500;
  const minUSDC = shareValue.mul(10_000 - slippageBps).div(10_000);

  const tx = await vault.redeemToBase(shareBN, minUSDC, userAddress);
  const receipt = await tx.wait();

  const event = receipt.events?.find((e: any) => e.event === "RedeemToBase");
  const usdcReceived = event?.args?.baseReceived as BigNumberish | undefined;

  return {
    tx,
    receipt,
    usdcReceived,
  };
}


