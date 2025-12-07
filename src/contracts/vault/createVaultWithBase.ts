import { ethers } from "ethers";
import MemeVaultFactoryABI from "../abi/MemeVaultFactory.json";
import CrtTokenABI from "../abi/CrtToken.json";
import DemoUSDCABI from "../abi/DemoUSDC.json";
import { CONTRACTS } from "../contracts";
import { getSigner } from "../ethersClient";

export interface CreateVaultWithBaseParams {
  name: string;
  symbol: string;
  baseAsset?: string; // defaults to CONTRACTS.USDC
  priceOracle?: string; // defaults to CONTRACTS.UniswapV3TWAPOracle
  description: string;
  imageURI?: string; // optional image URI
  baseAmount: number; // USDC amount (e.g., 1000 = 1,000 USDC)
  portfolioTokens: { address: string; weightBps: number }[]; // weight in basis points (total must be 10000)
}

// Helper function to ensure contract addresses are configured
function assertAddress(name: keyof typeof CONTRACTS) {
  const addr = CONTRACTS[name];
  if (!addr || addr === "0x0000000000000000000000000000000000000000") {
    throw new Error(`Contract address for ${name} is not configured.`);
  }
  return addr;
}

/**
 * Flow: Create Vault with USDC (Manager)
 *
 * Overview:
 * 1. Approve CRT tokens (creation fee)
 * 2. Approve USDC (base amount)
 * 3. Call createVaultWithBase() on factory
 * 4. Factory swaps USDC to portfolio tokens and initializes vault
 * 5. Manager receives NFT!
 */
export async function createVaultWithBase(params: CreateVaultWithBaseParams) {
  const signer = await getSigner();
  const userAddress = await signer.getAddress();

  const crtTokenAddr = assertAddress("CrtToken");
  const factoryAddr = assertAddress("MemeVaultFactory");
  const usdcAddr = params.baseAsset ?? assertAddress("USDC");
  const oracleAddr = params.priceOracle ?? assertAddress("UniswapV3TWAPOracle");

  // Validate weights sum to 10000 (100%)
  const totalWeight = params.portfolioTokens.reduce((sum, t) => sum + t.weightBps, 0);
  if (totalWeight !== 10000) {
    throw new Error(
      `Portfolio weights must sum to 10000 (100%), got ${totalWeight}`
    );
  }

  // ========== Step 1: Approve CRT creation fee ==========
  console.log("Step 1: Approving CRT tokens for creation fee...");
  const crtToken = new ethers.Contract(crtTokenAddr, CrtTokenABI.abi, signer);
  const createFee = ethers.utils.parseEther("1000"); // 1,000 CRT
  const approveCrtTx = await crtToken.approve(factoryAddr, createFee);
  await approveCrtTx.wait();
  console.log("CRT approved!");

  // ========== Step 2: Approve USDC ==========
  console.log("Step 2: Approving USDC...");
  const usdc = new ethers.Contract(usdcAddr, DemoUSDCABI.abi, signer);
  const baseAmount = ethers.utils.parseUnits(params.baseAmount.toString(), 6); // USDC has 6 decimals

  // Check balance
  const balance = await usdc.balanceOf(userAddress);
  if (balance.lt(baseAmount)) {
    throw new Error(
      `Insufficient USDC balance. Required: ${ethers.utils.formatUnits(
        baseAmount,
        6
      )}, Available: ${ethers.utils.formatUnits(balance, 6)}`
    );
  }

  const approveUsdcTx = await usdc.approve(factoryAddr, baseAmount);
  await approveUsdcTx.wait();
  console.log("USDC approved!");

  // ========== Step 3: Create Vault with Base ==========
  console.log("Step 3: Creating vault with base amount...");
  const factory = new ethers.Contract(factoryAddr, MemeVaultFactoryABI.abi, signer);

  const tx = await factory.createVaultWithBase(
    params.name, // name
    params.symbol, // symbol
    usdcAddr, // baseAsset
    oracleAddr, // priceOracle
    params.description, // description
    params.imageURI || "", // imageURI
    baseAmount, // baseAmount (USDC)
    params.portfolioTokens.map((t) => t.address), // portfolioTokens
    params.portfolioTokens.map((t) => t.weightBps) // targetWeightsBps
  );

  const receipt = await tx.wait();

  // Extract vault address from VaultCreated event
  const event = receipt.events?.find((e: any) => e.event === "VaultCreated");
  const vaultAddress: string | undefined = event?.args?.vault;

  console.log("Vault created with base!");
  console.log("Vault address:", vaultAddress);

  return {
    tx,
    receipt,
    vaultAddress,
    manager: userAddress,
  };
}
