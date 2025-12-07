import { BASE_URL } from ".";

/**
 * 사용자 프로필 정보
 */
export interface UserProfile {
  /** 지갑 주소 */
  wallet_address: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profile_url: string;
  /** 자기소개 */
  bio: string;
  /** Memex 링크 */
  memex_link: string;
  /** 블록 익스플로러 URL */
  explorer_url: string;
  /** 프로필 생성 시간 (ISO 문자열) */
  created_at: string;
  /** 프로필 수정 시간 (ISO 문자열) */
  updated_at: string;
}

/**
 * 프로필 초기화 요청
 */
export interface InitProfileRequest {
  /** 지갑 주소 */
  wallet_address: string;
}

/**
 * 프로필 업데이트 요청
 */
export interface UpdateProfileRequest {
  /** 지갑 주소 */
  wallet_address: string;
  /** 새로운 닉네임 */
  nickname: string;
}

/**
 * 프로필 이미지 업데이트 요청
 */
export interface UpdateProfileImageRequest {
  /** 지갑 주소 */
  wallet_address: string;
  /** 업로드할 이미지 파일 */
  file: File;
}

/**
 * POST /api/profile/init
 *
 * 새로운 사용자 프로필을 초기화합니다.
 * 지갑 주소를 기반으로 프로필을 생성하며, 프로필이 이미 존재하는 경우 기존 프로필을 반환합니다.
 * 
 * @param walletAddress - 초기화할 지갑 주소
 * @returns 생성되거나 조회된 프로필 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
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

/**
 * PUT /api/profile/image
 *
 * 프로필 이미지를 업로드하거나 업데이트합니다.
 * multipart/form-data 형식으로 파일을 전송합니다.
 * 
 * @param walletAddress - 이미지를 업데이트할 지갑 주소
 * @param file - 업로드할 이미지 파일
 * @returns 업데이트된 프로필 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
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


/**
 * GET /api/profile/{wallet_address}
 *
 * 지갑 주소로 사용자 프로필을 조회합니다.
 * 
 * @param walletAddress - 조회할 지갑 주소
 * @returns 프로필 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
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

/**
 * PATCH /api/profile
 *
 * 사용자 프로필의 닉네임을 업데이트합니다.
 * 
 * @param walletAddress - 업데이트할 지갑 주소
 * @param nickname - 새로운 닉네임
 * @returns 업데이트된 프로필 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
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


