import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Users, Wallet, Pencil, Copy } from "lucide-react";
import { useAccount } from "wagmi";
import {
    getProfile,
    initProfile,
    updateProfile,
    updateProfileImage,
    type UserProfile,
} from "../api/profile";
import { UserVaultList } from "../components/vault/UserVaultList";
import { useProfileContext } from "../context/ProfileContext";

export function UserProfile() {
    const { id } = useParams(); // nickname encoded (for URL only)
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editNickname, setEditNickname] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [addressCopyFeedback, setAddressCopyFeedback] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();
    const { address: connectedAddress } = useAccount();
    const { setProfile: setSharedProfile } = useProfileContext();

    useEffect(() => {
        if (!connectedAddress) {
            setProfile(null);
            setEditNickname("");
            setError("Please connect your wallet to view your profile.");
            return;
        }

        let cancelled = false;
        const run = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let p: UserProfile;
                try {
                    // 먼저 프로필 조회 시도
                    p = await getProfile(connectedAddress);
                } catch (getErr) {
                    // 프로필이 없으면 자동으로 생성
                    console.log("Profile not found, initializing new profile...");
                    p = await initProfile(connectedAddress);
                }
                
                if (!cancelled) {
                    setProfile(p);
                    setEditNickname(p.nickname);
                    setSharedProfile(p);

                    // Sync URL slug with current nickname (or fallback slug) if needed
                    const desiredSlug =
                        p.nickname?.trim() ||
                        `user-${p.wallet_address.slice(2, 8).toLowerCase()}`;
                    if (desiredSlug && id !== desiredSlug) {
                        navigate(`/profile/${encodeURIComponent(desiredSlug)}`, {
                            replace: true,
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch or init profile", err);
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load profile.",
                    );
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        void run();
        return () => {
            cancelled = true;
        };
    }, [connectedAddress, id, navigate, setSharedProfile]);

    if (isLoading && !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground font-mono">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-card border border-destructive/40 text-destructive px-6 py-4 rounded-lg font-mono text-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    const canEdit =
        connectedAddress &&
        connectedAddress.toLowerCase() === profile.wallet_address.toLowerCase();

    const handleStartEdit = () => {
        setEditNickname(profile.nickname);
        setUpdateError(null);
        setIsEditing(true);
    };

    const handleAvatarEditClick = () => {
        if (!canEdit || isUploadingImage) return;
        fileInputRef.current?.click();
    };

    const handleAvatarFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!profile) return;
        const file = event.target.files?.[0];
        if (!file) return;

        // Simple client-side guard (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("Image must be less than 5MB.");
            event.target.value = "";
            return;
        }

        setIsUploadingImage(true);
        setUploadError(null);
        try {
            const updated = await updateProfileImage(profile.wallet_address, file);
            setProfile(updated);
            if (canEdit) {
                setSharedProfile(updated);
            }
        } catch (err) {
            console.error("Failed to upload profile image", err);
            setUploadError(
                err instanceof Error
                    ? err.message
                    : "Failed to upload profile image.",
            );
        } finally {
            setIsUploadingImage(false);
            event.target.value = "";
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditNickname(profile.nickname);
        setUpdateError(null);
    };

    const handleSaveEdit = async () => {
        if (!profile || !editNickname.trim() || isUpdating) return;
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const updated = await updateProfile(
                profile.wallet_address,
                editNickname.trim(),
            );
            setProfile(updated);
            setEditNickname(updated.nickname);
            setIsEditing(false);
            if (canEdit) {
                setSharedProfile(updated);
            }
            const newSlug = updated.nickname?.trim();
            if (newSlug && id !== newSlug) {
                navigate(`/profile/${encodeURIComponent(newSlug)}`, {
                    replace: true,
                });
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            setUpdateError(
                err instanceof Error
                    ? err.message
                    : "Failed to update nickname.",
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCopyAddress = async () => {
        if (!profile?.wallet_address) return;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(profile.wallet_address);
                setAddressCopyFeedback("Copied!");
                setTimeout(() => setAddressCopyFeedback(null), 1500);
            }
        } catch (err) {
            console.error("Failed to copy profile address", err);
            setAddressCopyFeedback("Copy failed");
            setTimeout(() => setAddressCopyFeedback(null), 1500);
        }
    };


    return (
        <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-8 relative">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-carrot-orange/10 flex items-center justify-center text-3xl font-bold overflow-hidden">
                            {profile.profile_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.profile_url}
                                    alt={profile.nickname}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{profile.nickname.slice(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        {canEdit && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleAvatarEditClick}
                                    disabled={isUploadingImage}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-carrot-orange text-carrot-orange-foreground flex items-center justify-center border border-background shadow-md hover:bg-carrot-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarFileChange}
                                />
                            </>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold">{profile.nickname}</h1>
                            {canEdit && !isEditing && (
                                <button
                                    type="button"
                                    onClick={handleStartEdit}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-muted-foreground border border-border rounded hover:border-carrot-orange hover:text-carrot-orange transition-colors"
                                >
                                    <Pencil className="w-3 h-3" />
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 break-all">
                                <Wallet className="w-4 h-4" />
                                <span className="break-all">{profile.wallet_address}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyAddress}
                                    className="ml-1 inline-flex items-center justify-center p-1 rounded-full hover:bg-white/10"
                                    aria-label="Copy wallet address"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                                {addressCopyFeedback && (
                                    <span className="ml-1 text-[10px] text-carrot-orange font-mono">
                                        {addressCopyFeedback}
                                    </span>
                                )}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Profile created at{" "}
                                {new Date(profile.created_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {canEdit && uploadError && (
                    <p className="mt-3 text-xs text-error font-mono">
                        {uploadError}
                    </p>
                )}

                {canEdit && isEditing && (
                    <div className="mt-6 w-full max-w-md mx-auto md:mx-0">
                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase text-muted-foreground">
                                Edit Nickname
                            </label>
                            <input
                                type="text"
                                value={editNickname}
                                maxLength={32}
                                onChange={(e) => setEditNickname(e.target.value)}
                                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-carrot-orange"
                                placeholder="Enter new nickname"
                            />
                            {updateError && (
                                <p className="text-xs text-error font-mono">
                                    {updateError}
                                </p>
                            )}
                    </div>
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={isUpdating || !editNickname.trim()}
                                className="px-4 py-2 bg-carrot-orange text-carrot-orange-foreground text-xs font-mono rounded-md hover:bg-carrot-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-transparent border border-border text-xs font-mono rounded-md hover:bg-border/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                        </div>

            {/* Strategy Deck */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold font-pixel">
                            My Strategy Deck
                        </h2>
                        
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/ai-architect"
                            className="px-3 py-1.5 text-xs font-mono border border-carrot-orange text-carrot-orange rounded-md hover:bg-carrot-orange/10 transition-colors"
                        >
                            Create with AI
                        </Link>
                </div>
            </div>

                <UserVaultList addresses={[]} />
            </div>
        </div>
    );
}

