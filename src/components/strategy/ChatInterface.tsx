import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { StrategyPreview } from "./StrategyPreview";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    strategy?: any;
}

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI Strategy Architect. Tell me your risk tolerance and preferred assets, and I'll design a custom trading strategy for you."
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Mock AI response delay
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I've analyzed the market conditions and your preferences. Here is a strategy that fits your criteria:",
                strategy: {
                    name: "Meme Momentum Alpha",
                    description: "Aggressive strategy targeting high-volatility meme coins with strict stop-losses.",
                    assets: ["PEPE", "DOGE", "WIF"],
                    risk: "High",
                    estApy: 145.2
                }
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[600px] border border-border rounded-lg overflow-hidden bg-card">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[80%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'assistant' ? "bg-carrot-orange text-carrot-orange-foreground" : "bg-secondary text-secondary-foreground"
                        )}>
                            {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        <div className="space-y-2">
                            <div className={cn(
                                "p-3 rounded-lg text-sm",
                                msg.role === 'assistant'
                                    ? "bg-secondary text-secondary-foreground rounded-tl-none"
                                    : "bg-carrot-orange text-carrot-orange-foreground rounded-tr-none"
                            )}>
                                {msg.content}
                            </div>
                            {msg.strategy && <StrategyPreview strategy={msg.strategy} />}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-carrot-orange text-carrot-orange-foreground flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-secondary text-secondary-foreground p-3 rounded-lg rounded-tl-none text-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe your strategy idea..."
                        className="flex-1 bg-secondary border-transparent focus:border-carrot-orange rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carrot-orange"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-carrot-orange text-carrot-orange-foreground p-2 rounded-md hover:bg-carrot-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
