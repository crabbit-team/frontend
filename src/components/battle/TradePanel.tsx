import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function TradePanel() {
    const [amount, setAmount] = useState("");

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Trade Actions</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Asset</label>
                    <select className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>ETH / USDT</option>
                        <option>BTC / USDT</option>
                        <option>PEPE / USDT</option>
                        <option>DOGE / USDT</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Amount (USDT)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                        Buy
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors">
                        <ArrowDownRight className="w-4 h-4" />
                        Sell
                    </button>
                </div>
            </div>
        </div>
    );
}
