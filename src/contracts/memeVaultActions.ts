/**
 * @deprecated This file is deprecated.
 * Please use the new modular structure in `src/contracts/vault/`:
 * - `createVault` from `src/contracts/vault/createVault.ts`
 * - `issueWithBase` from `src/contracts/vault/issueWithBase.ts`
 * - `redeemToBase` from `src/contracts/vault/redeemToBase.ts`
 *
 * Or import from the barrel export: `import { createVault, issueWithBase, redeemToBase } from '../contracts/vault'`
 */

// Re-export from new location for backward compatibility
export { createVault, type CreateVaultParams } from "./vault/createVault";
export { createVaultWithBase, type CreateVaultWithBaseParams } from "./vault/createVaultWithBase";
export { issueWithBase, type IssueWithBaseParams } from "./vault/issueWithBase";
export { redeemToBase, type RedeemToBaseParams } from "./vault/redeemToBase";

// Legacy exports (for backward compatibility)
export type { IssueWithBaseParams as InvestWithUSDCParams } from "./vault/issueWithBase";
export type { RedeemToBaseParams as WithdrawToUSDCParams } from "./vault/redeemToBase";

// Legacy function aliases (for backward compatibility)
export { issueWithBase as investWithUSDC } from "./vault/issueWithBase";
export { redeemToBase as withdrawToUSDC } from "./vault/redeemToBase";
