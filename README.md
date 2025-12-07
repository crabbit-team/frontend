# 🥕 Crabbit

**Crabbit** is a decentralized finance (DeFi) platform that combines AI-powered strategy generation with gamified trading battles. Create, manage, and compete with your trading strategies in an engaging Web3 environment.

---

## 📋 Table of Contents / 목차

- [English](#english)
- [한국어](#한국어)

---

## English

### 🎯 Overview

Crabbit is a next-generation DeFi platform that empowers users to:
- **Generate AI-powered trading strategies** using natural language prompts
- **Battle AI opponents** in 1-minute strategy competitions
- **Manage investment vaults** with real-time performance tracking
- **Compete on leaderboards** and earn rewards
- **Connect Web3 wallets** for seamless blockchain integration

### ✨ Key Features

#### 🤖 AI Architect
- Generate trading strategies using AI with simple text prompts
- Customize token allocations and weights
- Preview strategy performance before deployment

#### ⚔️ Battle Arena
- 1-minute AI strategy battles
- Interactive mini-games during battles
- Earn CRT (Crabbit Token) rewards for victories
- Free to play - no capital required

#### 💼 Vault Management
- Create and manage investment vaults
- Deposit USDC to participate in strategies
- Track real-time performance (APY, TVL, 24h changes)
- View detailed analytics and charts

#### 📊 Rankings
- Strategy leaderboard based on historical ROI
- Tier system (Iron, Bronze, Silver, Gold, Diamond)
- Creator profiles with memex links
- Updated every 24 hours

#### 👤 User Profiles
- Personalized profile pages
- View created and deposited strategies
- Edit nickname and profile image
- Connect memex profiles

### 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.24
- **Web3 Integration**:
  - Wagmi 2.19.5
  - Viem 2.40.3
  - RainbowKit 2.2.9
  - Ethers.js 5.7.2
- **State Management**: React Query (TanStack Query) 5.90.11
- **Routing**: React Router DOM 7.9.6
- **Charts**: Recharts 3.5.1

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, WalletConnect, etc.)

#### Installation

```bash
# Clone the repository
git clone https://github.com/crabbit-team/frontend.git

# Navigate to the project directory
cd crabbit-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

#### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### 📁 Project Structure

```
src/
├── api/              # API integration layer
│   ├── battle.ts    # Battle-related API calls
│   ├── profile.ts   # User profile API
│   ├── Strategy.ts  # Strategy generation API
│   └── vault.ts     # Vault management API
├── components/      # React components
│   ├── battle/      # Battle game components
│   ├── common/      # Shared UI components
│   ├── layout/      # Layout components
│   ├── strategy/    # Strategy-related components
│   └── vault/       # Vault-related components
├── contracts/       # Smart contract integration
│   ├── abi/         # Contract ABIs
│   ├── hooks/       # Custom hooks for contracts
│   └── vault/       # Vault contract functions
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
└── router.tsx       # Application routing
```

### 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_CHAIN_ID=your_chain_id
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📝 License

This project is private and proprietary.

---

## 한국어

### 🎯 개요

Crabbit은 사용자가 다음을 수행할 수 있는 차세대 DeFi 플랫폼입니다:
- **AI 기반 거래 전략 생성**: 자연어 프롬프트를 사용하여 거래 전략 생성
- **AI 상대와 배틀**: 1분 전략 경쟁에서 AI 상대와 대전
- **투자 볼트 관리**: 실시간 성과 추적을 통한 투자 볼트 관리
- **리더보드 경쟁**: 리더보드에서 경쟁하고 보상 획득
- **Web3 지갑 연결**: 원활한 블록체인 통합을 위한 Web3 지갑 연결

### ✨ 주요 기능

#### 🤖 AI 아키텍트
- 간단한 텍스트 프롬프트로 AI를 사용하여 거래 전략 생성
- 토큰 할당 및 가중치 사용자 정의
- 배포 전 전략 성과 미리보기

#### ⚔️ 배틀 아레나
- 1분 AI 전략 배틀
- 배틀 중 인터랙티브 미니게임
- 승리 시 CRT(Crabbit Token) 보상 획득
- 무료 플레이 - 자본 불필요

#### 💼 볼트 관리
- 투자 볼트 생성 및 관리
- USDC 예치하여 전략 참여
- 실시간 성과 추적 (APY, TVL, 24시간 변화)
- 상세 분석 및 차트 보기

#### 📊 랭킹
- 과거 ROI 기반 전략 리더보드
- 티어 시스템 (Iron, Bronze, Silver, Gold, Diamond)
- 메멕스 링크가 있는 크리에이터 프로필
- 24시간마다 업데이트

#### 👤 사용자 프로필
- 개인화된 프로필 페이지
- 생성 및 예치한 전략 보기
- 닉네임 및 프로필 이미지 편집
- 메멕스 프로필 연결

### 🛠️ 기술 스택

- **프론트엔드 프레임워크**: React 19.2.0
- **언어**: TypeScript 5.9.3
- **빌드 도구**: Vite (Rolldown)
- **스타일링**: Tailwind CSS 3.4.17
- **애니메이션**: Framer Motion 12.23.24
- **Web3 통합**:
  - Wagmi 2.19.5
  - Viem 2.40.3
  - RainbowKit 2.2.9
  - Ethers.js 5.7.2
- **상태 관리**: React Query (TanStack Query) 5.90.11
- **라우팅**: React Router DOM 7.9.6
- **차트**: Recharts 3.5.1

### 🚀 시작하기

#### 사전 요구사항

- Node.js 18+ 및 npm
- Web3 지갑 (MetaMask, WalletConnect 등)

#### 설치

```bash
# 저장소 클론
git clone https://github.com/crabbit-team/frontend.git

# 프로젝트 디렉토리로 이동
cd crabbit-frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

애플리케이션은 `http://localhost:5173` (또는 다음 사용 가능한 포트)에서 사용할 수 있습니다.

#### 프로덕션 빌드

```bash
# 프로젝트 빌드
npm run build

# 프로덕션 빌드 미리보기
npm run preview
```

### 📁 프로젝트 구조

```
src/
├── api/              # API 통합 레이어
│   ├── battle.ts    # 배틀 관련 API 호출
│   ├── profile.ts   # 사용자 프로필 API
│   ├── Strategy.ts  # 전략 생성 API
│   └── vault.ts     # 볼트 관리 API
├── components/      # React 컴포넌트
│   ├── battle/      # 배틀 게임 컴포넌트
│   ├── common/      # 공유 UI 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트
│   ├── strategy/    # 전략 관련 컴포넌트
│   └── vault/       # 볼트 관련 컴포넌트
├── contracts/       # 스마트 컨트랙트 통합
│   ├── abi/         # 컨트랙트 ABI
│   ├── hooks/       # 컨트랙트용 커스텀 훅
│   └── vault/       # 볼트 컨트랙트 함수
├── context/         # React 컨텍스트 프로바이더
├── hooks/           # 커스텀 React 훅
├── pages/           # 페이지 컴포넌트
└── router.tsx       # 애플리케이션 라우팅
```

### 🔧 사용 가능한 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run lint` - ESLint 실행
- `npm run preview` - 프로덕션 빌드 미리보기

### 🌐 환경 변수

루트 디렉토리에 `.env` 파일 생성:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_CHAIN_ID=your_chain_id
```

### 🤝 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

### 📝 라이선스

이 프로젝트는 비공개이며 독점적입니다.

---

## 🎨 Design System

### Color Palette

- **Carrot Orange**: Primary brand color (HSL: 26 65% 54%)
- **Carrot Green**: Secondary brand color
- **Background**: Dark theme background
- **Foreground**: Light text color
- **Card**: Semi-transparent dark background

### Typography

- **Pixel Font**: Used for headings and UI elements
- **Mono Font**: Used for technical information and addresses
- **Tech Font**: Used for body text

---

## 📞 Contact / 연락처

For questions or support, please contact the Crabbit team.

질문이나 지원이 필요한 경우 Crabbit 팀에 문의하세요.

---

**Built with ❤️ by the Crabbit Team**
