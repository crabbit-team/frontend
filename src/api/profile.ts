import { BASE_URL } from ".";

export interface UserProfile {
  wallet_address: string;
  nickname: string;
  profile_url: string;
  created_at: string;
  updated_at: string;
  // Optional list of on-chain strategy (vault) contract addresses owned by this user.
  vault_addresses?: string[];
}

export interface InitProfileRequest {
  wallet_address: string;
}

export interface UpdateProfileRequest {
  wallet_address: string;
  nickname: string;
}

export interface UpdateProfileImageRequest {
  wallet_address: string;
  file: File;
}

export async function initProfile(
  walletAddress: string,
): Promise<UserProfile> {
  const body: InitProfileRequest = { wallet_address: walletAddress };

  const res = await fetch(`${BASE_URL}/api/profile/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Failed to init profile (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = (await res.json()) as UserProfile;
  return data;
}

// Upload or update profile image via multipart/form-data
export async function updateProfileImage(
  walletAddress: string,
  file: File,
): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("wallet_address", walletAddress);
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/profile/image`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    let message = `Failed to update profile image (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = (await res.json()) as UserProfile;
  return data;
}


export async function getProfile(walletAddress: string): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/api/profile/${encodeURIComponent(walletAddress)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch profile (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = (await res.json()) as UserProfile;
  return data;
}

export async function updateProfile(
  walletAddress: string,
  nickname: string,
): Promise<UserProfile> {
  const body: UpdateProfileRequest = {
    wallet_address: walletAddress,
    nickname,
  };

  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Failed to update profile (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = (await res.json()) as UserProfile;
  return data;
}


