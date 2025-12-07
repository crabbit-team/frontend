import type { ReactNode } from "react";
import { useRequiredChain } from "../hooks/useRequiredChain";

interface NetworkGuardProps {
  requiredChainId: number;
  children: ReactNode;
}

export function NetworkGuard({ requiredChainId, children }: NetworkGuardProps) {
  const { isCorrectChain, isSwitching, requiredChain, requestSwitch } =
    useRequiredChain({ requiredChainId });

  if (isCorrectChain) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-card border border-warning/40 text-warning-foreground px-6 py-4 rounded-lg max-w-md text-center space-y-3">
        <p className="text-sm font-mono">
          This page is only available on{" "}
          <span className="font-bold">
            {requiredChain?.name ?? "the required network"}
          </span>
          .
        </p>
        <button
          type="button"
          onClick={requestSwitch}
          disabled={isSwitching}
          className="px-4 py-2 text-xs font-mono rounded-md bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwitching ? "Switching..." : "Switch network"}
        </button>
        <p className="text-[11px] text-muted-foreground font-mono">
          Please switch your wallet to continue. All actions are disabled until
          you are on the correct chain.
        </p>
      </div>
    </div>
  );
}


