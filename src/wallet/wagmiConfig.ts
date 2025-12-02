import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";
import { defineChain } from "viem";

// MemeCore Insectarium (custom chain)
// NOTE: Replace rpcUrls and blockExplorer URLs with the actual MemeCore endpoints.
export const memeCoreInsectarium = defineChain({
  id: 43521,
  name: "MemeCore Insectarium",
  nativeCurrency: {
    name: "CRT",
    symbol: "CRT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.memecore-insectarium.example"], // TODO: real RPC URL
    },
    public: {
      http: ["https://rpc.memecore-insectarium.example"], // TODO: real RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "MemeCoreScan",
      url: "https://explorer.memecore-insectarium.example", // TODO: real explorer URL
    },
  },
  testnet: true,
});

// WalletConnect Project ID should be provided via env in a real app.
// For now we read from VITE_WALLETCONNECT_PROJECT_ID and fall back to a placeholder.
const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
  "demo-walletconnect-project-id";

export const wagmiConfig = getDefaultConfig({
  appName: "Crabbit",
  projectId,
  chains: [memeCoreInsectarium, base, baseSepolia],
  ssr: false,
});





