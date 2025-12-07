import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Copy } from "lucide-react";
import { initProfile } from "../../api/profile";
import { useProfileContext } from "../../context/ProfileContext";

export function WalletProfileButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();
  const { profile, setProfile } = useProfileContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Fetch / init profile once wallet is connected
  useEffect(() => {
    if (!isConnected || !address) {
      setProfile(null);
      setIsDropdownOpen(false);
      setIsLoadingProfile(false);
      setError(null);
      return;
    }

    if (profile || isLoadingProfile) return;

    const run = async () => {
      setIsLoadingProfile(true);
      setError(null);
      try {
        const p = await initProfile(address);
        setProfile(p);
      } catch (err) {
        console.error("Failed to init profile", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile. Showing wallet address.",
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const handleClick = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (!profile && !isLoadingProfile) {
      // Connected but profile not ready yet, try refetch
      return;
    }
    setIsDropdownOpen((prev) => !prev);
    setCopyFeedback(null);
  };

  const handleCopyAddress = async () => {
    if (!profile?.wallet_address) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(profile.wallet_address);
        setCopyFeedback("Copied!");
        setTimeout(() => setCopyFeedback(null), 1500);
      } else {
        // Fallback: select text not implemented here, just log
        console.log("Clipboard API not available");
      }
    } catch (err) {
      console.error("Failed to copy address", err);
      setCopyFeedback("Copy failed");
      setTimeout(() => setCopyFeedback(null), 1500);
    }
  };

  const handleLogout = () => {
    // Disconnect wallet session and clear profile state
    disconnect();
    setProfile(null);
    setIsDropdownOpen(false);
    navigate("/", { replace: true });
  };

  let label: string;
  if (!isConnected) {
    label = "[ CONNECT WALLET ]";
  } else if (isLoadingProfile) {
    label = "Loading...";
  } else if (profile?.nickname) {
    label = profile.nickname;
  } else if (address) {
    label = `${address.slice(0, 6)}...${address.slice(-4)}`;
  } else {
    label = "Wallet";
  }

  return (
    <div className="wallet-profile-wrapper relative">
      {/* Existing button UI – keep this structure and styling */}
      <button
        type="button"
        className="bg-carrot-orange/10 border border-carrot-orange text-carrot-orange px-6 py-2 rounded-none font-pixel text-xs hover:bg-carrot-orange hover:text-carrot-orange-foreground transition-all clip-path-polygon wallet-connect-btn"
        onClick={handleClick}
      >
        <span className="wallet-connect-label">{label}</span>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && profile && (
        <div className="wallet-dropdown absolute right-0 mt-2 w-64 bg-card border border-carrot-orange/40 rounded-xl shadow-xl z-50">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="wallet-address-row px-3 py-2 text-[11px] font-mono text-muted-foreground break-all text-left hover:bg-carrot-orange/10 w-full flex items-center justify-between gap-2"
          >
            <span className="break-all flex-1">{profile.wallet_address}</span>
            <Copy className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
            {copyFeedback && (
              <span className="ml-2 text-[10px] text-carrot-orange font-bold">
                {copyFeedback}
              </span>
            )}
          </button>
          <div className="h-px bg-white/10 mx-2" />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-[11px] font-mono text-error hover:bg-error/10"
          >
            Log out
          </button>
        </div>
      )}

      {/* Optional small error text */}
      {error && (
        <div className="mt-1 text-[10px] text-error font-mono">
          {error}
        </div>
      )}
    </div>
  );
}


