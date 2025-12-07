/**
 * Vault 컨트랙트 함수들
 * 
 * 이 모듈은 vault 관련 모든 컨트랙트 상호작용 함수들을 포함합니다:
 * - createVault: 새 Vault 생성 (매니저)
 * - issueWithBase: USDC로 투자 (투자자)
 * - redeemToBase: USDC로 인출 (투자자)
 */

export { createVault, type CreateVaultParams } from "./createVault";
export { issueWithBase, type IssueWithBaseParams } from "./issueWithBase";
export { redeemToBase, type RedeemToBaseParams } from "./redeemToBase";

