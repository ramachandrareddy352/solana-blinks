// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BlinksIDL from '../target/idl/blinks.json'
import type { Blinks } from '../target/types/blinks'

// Re-export the generated IDL and type
export { Blinks, BlinksIDL }

// The programId is imported from the program IDL.
export const BLINKS_PROGRAM_ID = new PublicKey(BlinksIDL.address)

// This is a helper function to get the Blinks Anchor program.
export function getBlinksProgram(provider: AnchorProvider) {
  return new Program(BlinksIDL as Blinks, provider)
}

// This is a helper function to get the program ID for the Blinks program depending on the cluster.
export function getBlinksProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Blinks program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return BLINKS_PROGRAM_ID
  }
}
