import { type Address } from "viem";
import MemeVaultFactoryABI from "./abi/MemeVaultFactory.json";
import MemeVaultABI from "./abi/MemeVault.json";
import CrtTokenABI from "./abi/CrtToken.json";
import DemoUSDCABI from "./abi/DemoUSDC.json";
import VaultManagerNFTABI from "./abi/VaultManagerNFT.json";
import UniswapV3TWAPOracleABI from "./abi/UniswapV3TWAPOracle.json";
import FeeCollectorABI from "./abi/FeeCollector.json";
import RewardDistributorABI from "./abi/RewardDistributor.json";

/**
 * 컨트랙트 주소 정의
 * 실제 배포된 주소로 업데이트 필요
 */
export const CONTRACT_ADDRESSES = {
  // Core protocol contracts on MemeCore Insectarium Testnet (Chain ID: 43522)
  CrtToken: "0x8371e24Ad7252f4BE6dE1AE7F589Fd82A4bcb940" as Address, // CRT token (CarrotToken)
  MemeVaultFactory: "0xC83C2F3D8DB882dF24ACC770978C66c95FAcDa25" as Address, // Vault creation factory
  VaultManagerNFT: "0x3c78DBb43fb9e1c4ad126c4A7D7Dd68a31Cb423F" as Address, // Manager NFT
  UniswapV3TWAPOracle: "0xAD6acF19b5eEd4580C9513a8F4A9DC86A1E66c40" as Address, // Price oracle
  FeeCollector: "0x4c8012f9d3ca8576bCCc465080838D66dcd0576E" as Address, // Fee collector
  RewardDistributor: "0x279EaeE3e85FD717261793FAf1ec46c0ecfd1cFE" as Address, // Reward distributor

  // External contracts (pre-deployed on Insectarium)
  SwapRouter: "0x12BDD778C77FBD6b82757f42C529300937d75C63" as Address,
  USDC: "0x3eeBc5bEE5B6A26fE5f47eF46124EdbF4D29161E" as Address, // Demo USDC
} as const;

/**
 * 컨트랙트 설정 (주소 + ABI)
 * wagmi의 useReadContract, useWriteContract에서 사용
 */
export const CONTRACT_CONFIGS = {
  CrtToken: {
    address: CONTRACT_ADDRESSES.CrtToken,
    abi: CrtTokenABI.abi,
  },
  MemeVaultFactory: {
    address: CONTRACT_ADDRESSES.MemeVaultFactory,
    abi: MemeVaultFactoryABI.abi,
  },
  MemeVault: {
    // 동적 주소 (vault별로 다름)
    abi: MemeVaultABI.abi,
  },
  DemoUSDC: {
    address: CONTRACT_ADDRESSES.USDC,
    abi: DemoUSDCABI.abi,
  },
  VaultManagerNFT: {
    address: CONTRACT_ADDRESSES.VaultManagerNFT,
    abi: VaultManagerNFTABI.abi,
  },
  UniswapV3TWAPOracle: {
    address: CONTRACT_ADDRESSES.UniswapV3TWAPOracle,
    abi: UniswapV3TWAPOracleABI.abi,
  },
  FeeCollector: {
    address: CONTRACT_ADDRESSES.FeeCollector,
    abi: FeeCollectorABI.abi,
  },
  RewardDistributor: {
    address: CONTRACT_ADDRESSES.RewardDistributor,
    abi: RewardDistributorABI.abi,
  },
} as const;

/**
 * 특정 vault 주소로 MemeVault 설정 생성
 */
export function getMemeVaultConfig(vaultAddress: Address) {
  return {
    address: vaultAddress,
    abi: MemeVaultABI.abi,
  } as const;
}

