import { useEffect, useMemo, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";

interface UseRequiredChainOptions {
  requiredChainId: number;
}

export function useRequiredChain({ requiredChainId }: UseRequiredChainOptions) {
  const currentChainId = useChainId();
  const { chains, switchChain, isPending: isSwitching } = useSwitchChain();
  const [hasPrompted, setHasPrompted] = useState(false);

  const requiredChain = useMemo(
    () => chains.find((c) => c.id === requiredChainId),
    [chains, requiredChainId],
  );

  const isCorrectChain = currentChainId === requiredChainId;

  useEffect(() => {
    if (!isCorrectChain) {
      setHasPrompted(false);
    }
  }, [isCorrectChain]);

  const requestSwitch = () => {
    if (!requiredChain || !switchChain) return;
    setHasPrompted(true);
    switchChain({ chainId: requiredChain.id });
  };

  return {
    isCorrectChain,
    isSwitching,
    requiredChain,
    requestSwitch,
    hasPrompted,
  };
}


