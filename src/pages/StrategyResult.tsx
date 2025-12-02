import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { StrategyGenerateResponse } from "../api/strategy";
import { StrategyResultCard } from "../components/strategy/StrategyResultCard";
import { investWithUSDC } from "../contracts/memeVaultActions";

interface StrategyLocationState {
  strategy?: StrategyGenerateResponse;
}

export function StrategyResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StrategyLocationState | undefined;
  const strategy = state?.strategy;

  const [vaultAddress, setVaultAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txInfo, setTxInfo] = useState<string | null>(null);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-[#0c0b10] text-white flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-400 font-mono">
            No strategy found. Generate a strategy first from the AI Architect page.
          </p>
          <button
            type="button"
            onClick={() => navigate("/ai-architect")}
            className="px-4 py-2 text-xs font-mono rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to AI Architect
          </button>
        </div>
      </div>
    );
  }

  const handleDeposit = async () => {
    setTxError(null);
    setTxInfo(null);

    const amountNum = Number(depositAmount);
    if (!vaultAddress.trim()) {
      setTxError("Vault address is required.");
      return;
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setTxError("Enter a valid deposit amount in USDC.");
      return;
    }

    try {
      setIsDepositing(true);
      const result = await investWithUSDC({
        vaultAddress: vaultAddress.trim(),
        usdcAmount: amountNum,
      });
      setTxInfo("Deposit transaction completed successfully.");
      if (result.sharesReceived) {
        setTxInfo(
          `Deposit completed. Shares minted: ${result.sharesReceived.toString()}`,
        );
      }
    } catch (err) {
      console.error("Failed to deposit to vault", err);
      setTxError(
        err instanceof Error ? err.message : "Failed to deposit to vault.",
      );
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b10] text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-pixel tracking-tight">
            AI-Generated Strategy
          </h1>
          <p className="text-sm text-gray-400 font-mono">
            This is the strategy generated from your last prompt. You can save it, share it, or
            use it as a template for a vault.
          </p>
        </div>

        <StrategyResultCard
          variant="real"
          description={strategy.description}
          reasoning={strategy.reasoning}
          tokens={strategy.tokens}
          weights={strategy.weights}
        />

        {/* Initial deposit + contract interaction */}
        <div className="mt-8 space-y-4 bg-[#13121a] border border-white/10 rounded-2xl p-4 md:p-6">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono">
            Fund this strategy on-chain
          </h2>
          <p className="text-xs text-gray-500 font-mono">
            Enter a vault address and an initial USDC amount to send a test deposit transaction.
            In the real flow, this strategy will be linked to a specific MemeVault.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase">
                Vault Address
              </label>
              <input
                type="text"
                value={vaultAddress}
                onChange={(e) => setVaultAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400 uppercase">
                Initial Deposit (USDC)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleDeposit}
              disabled={isDepositing}
              className="px-4 py-2 text-xs font-mono rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDepositing ? "Depositing..." : "Deposit"}
            </button>
          </div>

          {txError && (
            <p className="text-[11px] text-red-400 font-mono mt-1">{txError}</p>
          )}
          {txInfo && (
            <p className="text-[11px] text-emerald-400 font-mono mt-1">
              {txInfo}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/ai-architect")}
            className="px-3 py-1.5 text-xs font-mono border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
          >
            Back to AI Architect
          </button>
        </div>
      </div>
    </div>
  );
}


