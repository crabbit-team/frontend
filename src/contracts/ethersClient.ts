import { ethers } from "ethers";

declare global {
  interface Window {
    // Injected by wallet extensions (MetaMask, RainbowKit connectors, etc.)
    ethereum?: unknown;
  }
}

// Read-only JSON-RPC provider for MemeCore.
// Use this for calls that don't require the connected wallet.
export function getReadOnlyProvider() {
  return new ethers.providers.JsonRpcProvider("https://rpc.memecore.net");
}

// Browser-injected provider (e.g. MetaMask). Requires the user to have a
// wallet extension installed and (via RainbowKit) connected.
export function getBrowserProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No injected Ethereum provider found. Please connect a wallet.");
  }
  return new ethers.providers.Web3Provider(window.ethereum as any);
}

// Convenience helper to get the current signer from the browser provider.
// This is what you should pass into contract helper functions.
export async function getSigner() {
  const provider = getBrowserProvider();
  return provider.getSigner();
}


