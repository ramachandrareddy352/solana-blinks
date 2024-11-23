import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Blinks} from '../target/types/blinks'

describe('blinks', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Blinks as Program<Blinks>

  const blinksKeypair = Keypair.generate()

  it('Initialize Blinks', async () => {
    await program.methods
      .initialize()
      .accounts({
        blinks: blinksKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([blinksKeypair])
      .rpc()

    const currentCount = await program.account.blinks.fetch(blinksKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Blinks', async () => {
    await program.methods.increment().accounts({ blinks: blinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.blinks.fetch(blinksKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Blinks Again', async () => {
    await program.methods.increment().accounts({ blinks: blinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.blinks.fetch(blinksKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Blinks', async () => {
    await program.methods.decrement().accounts({ blinks: blinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.blinks.fetch(blinksKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set blinks value', async () => {
    await program.methods.set(42).accounts({ blinks: blinksKeypair.publicKey }).rpc()

    const currentCount = await program.account.blinks.fetch(blinksKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the blinks account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        blinks: blinksKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.blinks.fetchNullable(blinksKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
