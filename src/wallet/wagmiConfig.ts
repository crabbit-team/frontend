import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";
import { defineChain } from "viem";

// MemeCore Insectarium (custom chain)
export const memeCoreInsectarium = defineChain({
  id: 43522,
  name: "MemeCore Insectarium",
  nativeCurrency: {
    name: "MemeCore",
    symbol: "M",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.insectarium.memecore.net"],
    },
    public: {
      http: ["https://rpc.insectarium.memecore.net"],
    },
  },
  blockExplorers: {
    default: {
      name: "MemeCoreScan",
      url: "https://explorer.insectarium.memecore.net",
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





