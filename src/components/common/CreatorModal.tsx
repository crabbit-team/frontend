import { X, ExternalLink } from "lucide-react";
import type { VaultCreator } from "../../api/vault";

interface CreatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    creator: VaultCreator;
    vaultName?: string;
}

export function CreatorModal({ isOpen, onClose, creator, vaultName: _vaultName }: CreatorModalProps) {
    if (!isOpen) return null;

    const handleMemexLink = () => {
        if (creator.memex_link) {
            window.open(creator.memex_link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-card w-full max-w-md rounded-lg p-6 shadow-lg animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold font-pixel">Creator Profile</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Creator Image */}
                    <div className="flex justify-center">
                        {creator.image_url && creator.image_url.trim() ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-carrot-orange/10 flex items-center justify-center ring-4 ring-carrot-orange/20">
                                <img
                                    src={creator.image_url}
                                    alt="Creator"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-carrot-orange/10 flex items-center justify-center ring-4 ring-carrot-orange/20 text-carrot-orange text-2xl font-mono">
                                ?
                            </div>
                        )}
                    </div>

                    {/* Memex Link Button */}
                    {creator.memex_link && creator.memex_link.trim() ? (
                        <button
                            onClick={handleMemexLink}
                            className="w-full bg-carrot-orange text-carrot-orange-foreground py-3 rounded-md font-medium hover:bg-carrot-orange/90 transition-colors flex items-center justify-center gap-2 font-pixel"
                        >
                            <span>View on Memex</span>
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="w-full bg-secondary/50 text-muted-foreground py-3 rounded-md font-medium flex items-center justify-center gap-2 font-pixel">
                            <span>memex: Not yet</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

