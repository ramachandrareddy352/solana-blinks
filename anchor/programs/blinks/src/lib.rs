#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod blinks {
    use super::*;

  pub fn close(_ctx: Context<CloseBlinks>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.blinks.count = ctx.accounts.blinks.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.blinks.count = ctx.accounts.blinks.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeBlinks>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.blinks.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeBlinks<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Blinks::INIT_SPACE,
  payer = payer
  )]
  pub blinks: Account<'info, Blinks>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseBlinks<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub blinks: Account<'info, Blinks>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub blinks: Account<'info, Blinks>,
}

#[account]
#[derive(InitSpace)]
pub struct Blinks {
  count: u8,
}
