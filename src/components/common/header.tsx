import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { WalletProfileButton } from "./WalletProfileButton";
import { useProfileContext } from "../../context/ProfileContext";

export function Header() {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { profile } = useProfileContext();

    const handleMyPageClick = () => {
        if (!isConnected || !address) {
            return;
        }
        // Use nickname as the profile route param if available,
        // otherwise use a short, non-sensitive slug based on the address
        const slug =
            profile?.nickname?.trim() ||
            `user-${address.slice(2, 8).toLowerCase()}`;
        navigate(`/profile/${encodeURIComponent(slug)}`);
    };

    return (
        <header className="border-b border-carrot-orange/30 sticky top-0 bg-background/90 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight font-pixel hover:opacity-80 transition-opacity">
                    <span className="text-carrot-orange">C</span><span className="text-carrot-green">
                        RABBIT
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider uppercase">
                    <Link to="/battle" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        Battle
                    </Link>
                    <Link to="/rank" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        Rank
                    </Link>
                    <Link to="/ai-architect" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        AI-Architect
                    </Link>
                    {isConnected && (
                        <button
                            onClick={handleMyPageClick}
                            className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all"
                        >
                            MyPage
                        </button>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <WalletProfileButton />
                </div>
            </div>
        </header>
    );
}
