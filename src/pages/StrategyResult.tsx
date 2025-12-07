import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { StrategyGenerateResponse } from "../api/Strategy";
import { StrategyResultCard } from "../components/strategy/StrategyResultCard";
import { CONTRACT_ADDRESSES } from "../contracts/config";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useCreateVault } from "../contracts/hooks/useCreateVault";
import { useDepositToVault } from "../contracts/hooks/useDepositToVault";
import { type Address } from "viem";
import { formatUnits } from "viem";

interface StrategyLocationState {
  strategy?: StrategyGenerateResponse;
}

export function StrategyResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StrategyLocationState | undefined;
  const strategy = state?.strategy;

  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // USDC 잔액 조회
  const { balance: usdcBalance, isLoading: isLoadingBalance } = useTokenBalance({
    tokenAddress: CONTRACT_ADDRESSES.USDC,
    userAddress: address,
    enabled: isConnected && !!address,
  });

  // Vault 생성 hook
  const {
    createVaultWithParams,
    isCreating,
    isConfirmingCreate,
    isCreated,
    vaultAddress: createdVaultAddress,
    error: createVaultError,
  } = useCreateVault();

  // Deposit hook
  const {
    depositToVault,
    isDepositing,
    isConfirmingDeposit,
    isDeposited,
    error: depositError,
  } = useDepositToVault();

  const [depositAmount, setDepositAmount] = useState("");
  const [currentVaultAddress, setCurrentVaultAddress] = useState<Address | undefined>();
  const [txError, setTxError] = useState<string | null>(null);
  const [txInfo, setTxInfo] = useState<string | null>(null);

  // Vault 생성 완료 시 주소 저장
  useEffect(() => {
    if (isCreated && createdVaultAddress) {
      setCurrentVaultAddress(createdVaultAddress);
      setTxInfo("Vault created successfully! Proceeding with deposit...");
    }
  }, [isCreated, createdVaultAddress]);

  // Deposit 완료 시 처리
  useEffect(() => {
    if (isDeposited) {
      setTxInfo("Deposit completed successfully!");
      setDepositAmount("");
    }
  }, [isDeposited]);

  // 에러 처리
  useEffect(() => {
    if (createVaultError) {
      setTxError(createVaultError.message || "Failed to create vault.");
    }
  }, [createVaultError]);

  useEffect(() => {
    if (depositError) {
      setTxError(depositError.message || "Failed to deposit to vault.");
    }
  }, [depositError]);

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground font-mono">
            No strategy found. Generate a strategy first from the AI Architect page.
          </p>
          <button
            type="button"
            onClick={() => navigate("/ai-architect")}
            className="px-4 py-2 text-xs font-mono rounded-md bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 transition-colors"
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

    // 지갑 연결 확인
    if (!isConnected || !address) {
      openConnectModal?.();
      return;
    }

    const amountNum = Number(depositAmount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setTxError("Enter a valid deposit amount in USDC.");
      return;
    }

    // USDC 잔액 확인
    if (usdcBalance) {
      const balanceFormatted = parseFloat(formatUnits(usdcBalance as bigint, 6));
      if (balanceFormatted < amountNum) {
        setTxError(
          `Insufficient USDC balance. Available: ${balanceFormatted.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} USDC`
        );
        return;
      }
    }

    try {
      let targetVaultAddress = currentVaultAddress;

      // 1. Vault가 없으면 먼저 생성
      if (!targetVaultAddress) {
        setTxInfo("Creating vault...");

        // 포트폴리오 토큰 준비 (가중치를 basis points로 변환: weight% * 100)
        const portfolioTokens = strategy.tokens.map((token) => ({
          address: token.address as Address,
          weightBps: Math.round(token.weight * 100), // weight % -> basis points (e.g., 30% -> 3000 bps)
        }));

        await createVaultWithParams({
          name: strategy.name,
          symbol: strategy.symbol,
          description: strategy.description,
          imageURI: strategy.image_url, // API에서 받은 이미지 URL
          baseAmount: amountNum.toString(), // USDC 금액
          portfolioTokens,
        });

        // Vault 생성 완료 대기 (useEffect에서 처리)
        return;
      }

      // 2. Vault 생성 완료 후 또는 이미 존재하는 경우 Deposit 실행
      if (targetVaultAddress) {
        setTxInfo("Processing deposit...");
        await depositToVault({
          vaultAddr: targetVaultAddress,
          amount: depositAmount,
          slippageBps: 500, // 5%
        });
      }
    } catch (err) {
      console.error("Failed to process deposit", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to process deposit.";
      setTxError(errorMessage);
      setTxInfo(null);
    }
  };

  const isProcessing = isCreating || isConfirmingCreate || isDepositing || isConfirmingDeposit;
  const usdcBalanceFormatted = usdcBalance
    ? parseFloat(formatUnits(usdcBalance as bigint, 6))
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-carrot-green/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl space-y-8">
        <div className="space-y-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-pixel tracking-tight">
              AI-Generated Strategy
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            This is the strategy generated from your last prompt. You can save it, share it, or use
            it as a template for a vault.
          </p>
        </div>

        <StrategyResultCard
          variant="real"
          name={strategy.name}
          symbol={strategy.symbol}
          description={strategy.description}
          reasoning={strategy.reasoning}
          tokens={strategy.tokens}
        />

        {/* Initial deposit + contract interaction */}
        <div className="mt-8 space-y-4 bg-card border border-border rounded-2xl p-4 md:p-6">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-mono">
            Fund this strategy on-chain
          </h2>
          <p className="text-xs text-muted-foreground font-mono">
            Enter an initial USDC amount. A vault will be created automatically if it doesn't exist,
            then your deposit will be processed.
          </p>

          {/* 지갑 연결 안내 */}
          {!isConnected && (
            <div className="p-4 bg-warning/10 border border-warning/40 rounded-lg">
              <p className="text-sm text-warning-foreground font-mono">
                Please connect your wallet to proceed with the deposit.
              </p>
              <button
                type="button"
                onClick={openConnectModal}
                className="mt-2 px-4 py-2 text-xs font-mono rounded-md bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Vault Information Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border border-border">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground uppercase">Name</label>
              <div className="text-sm font-mono text-foreground">{strategy.name || "N/A"}</div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground uppercase">
                Ticker
              </label>
              <div className="text-sm font-mono text-foreground">{strategy.symbol || "N/A"}</div>
            </div>
          </div>

          {/* Deposit Input */}
          {isConnected && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-muted-foreground uppercase">
                  Initial Deposit (USDC)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-carrot-orange"
                  disabled={isProcessing}
                />
                {/* 현재 지갑 USDC 잔액 표시 */}
                <div className="text-[10px] font-mono text-muted-foreground mt-1">
                  {isLoadingBalance ? (
                    <span>Loading balance...</span>
                  ) : (
                    <span>
                      Available: {usdcBalanceFormatted.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDC
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className="px-4 py-2 text-xs font-mono rounded-md bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating || isConfirmingCreate
                  ? "Creating Vault..."
                  : isDepositing || isConfirmingDeposit
                    ? "Depositing..."
                    : "Deposit"}
              </button>
            </div>
          )}

          {txError && <p className="text-[11px] text-error font-mono mt-1">{txError}</p>}
          {txInfo && <p className="text-[11px] text-success font-mono mt-1">{txInfo}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate("/ai-architect")}
            className="px-3 py-1.5 text-xs font-mono border border-carrot-orange text-carrot-orange rounded-md hover:bg-carrot-orange/10 transition-colors"
          >
            Back to AI Architect
          </button>
        </div>
      </div>
    </div>
  );
}
