import { useState } from "react";
import { X } from "lucide-react";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    vaultName: string;
}

export function DepositModal({ isOpen, onClose, vaultName }: DepositModalProps) {
    const [amount, setAmount] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-lg animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Deposit into {vaultName}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Amount (USDT)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carrot-orange"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-carrot-orange hover:text-carrot-orange/80">
                                MAX
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Balance: 1,250.00 USDT</p>
                    </div>

                    <div className="bg-secondary/50 rounded-md p-3 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. APY</span>
                            <span className="font-medium text-success">124.5%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Lock-up Period</span>
                            <span className="font-medium">7 Days</span>
                        </div>
                    </div>

                    <button className="w-full bg-carrot-orange text-carrot-orange-foreground py-2 rounded-md font-medium hover:bg-carrot-orange/90 transition-colors">
                        Confirm Deposit
                    </button>
                </div>
            </div>
        </div>
    );
}
