# Paystream-P2P Engine

[![Paystream Protocol](https://img.shields.io/badge/Paystream-Protocol-blue)](https://app.paystream.finance/optimizers/drift)

## Overview

Paystream is a peer-to-peer lending protocol built on Solana that allows users to lend and borrow assets directly. This repository contains the development environment and tools necessary to interact with the Paystream protocol on Solana's devnet.




## Demo

Check out our live demo: [Paystream](https://youtu.be/pkN8J2qtoZ8)

## Demo

https://github.com/user-attachments/assets/fd14ecd9-ca84-4ba5-969f-31a50259dc09


## Getting Started

### Prerequisites

- Solana wallet (e.g., Phantom, Solflare)
- Basic understanding of DeFi lending protocols
- Familiarity with Solana blockchain

### Main-net Access

Only whitelisted addresses can interact with the Paystream app.

If you are not whitelisted yet, join our [Telegram](https://t.me/paystreamfi) and follow the instructions to request access.


## Protocol Flow

The Paystream protocol supports the following operations:

1. **Lending** - Provide assets to the protocol to earn interest
2. **Borrowing** - Borrow assets from the protocol (with appropriate collateral)
3. **Repayment** - Repay borrowed assets plus interest
4. **Withdrawal** - Withdraw your lent assets and accrued interest

### Important Rules

- Users cannot be both a lender and a borrower in the same market
- Repayments and withdrawals are managed through the dashboard window
- The dashboard can be accessed from within the vault or from the optimizer window

## Testing Flow Example

1. Lend USDC to the protocol
2. Borrow SOL against your USDC collateral
3. Repay your SOL debt
4. Withdraw your USDC lent funds

## Architecture Diagram

![image](https://github.com/user-attachments/assets/324b4146-7493-4e3a-b8a1-8a31584cc0ae)


## Technical Documentation

The protocol documentation is available in the [Docs ](https://maushish-guide.notion.site/Paystream-14fe89e3279f80c883f5e12574e00922?pvs=74). Key components include:

- Market architecture
- Lending/borrowing mechanisms
- Interest rate models
- Liquidation procedures
- Security features

## Development
Contract Information for Testers
Protocol Contract Details

Program ID: ``` dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH (Solana Devnet)```
Protocol Version: ``` 2.117.0```
Contract Name: ```drift```

Account Structure
The protocol operates with these primary account types:

- User Account - Stores individual lending/borrowing positions
- UserStats Account - Tracks user activity and transaction history
- State Account - Maintains global protocol parameters

## API Documentation

### Market Operations

#### Market Initialization and Management
- `initializeMarket(mint, marketId, feeRecipient, tokenProgram, market, collateralMarket, collateralTokenProgram, collateralMint, conversionRateWithPricePrecision, preInstructions?)`: Initialize a new market
- `updateMarketHeader(market, mint, feeRecipient, enableP2pLending, updateMarketStatus, conversionRateWithPricePrecision)`: Update market configuration
- `getMarketHeader(market, mint)`: Get market header information
- `getAllMarketHeaders()`: Get all market headers
- `getMarketHeaderUI(marketPublicKey, mint)`: Get market header information in UI-friendly format
- `getMarketDataUI(marketPublicKey, mint)`: Get market data in UI-friendly format

#### Market Data Queries
- `getMarket(marketPublicKey)`: Get market data
- `getMarketPriceData(lendingMarket, mint)`: Get market price data
- `getVaultBalance(market, mint)`: Get vault balance for a market
- `getTokenDecimals(mint)`: Get token decimals

### Trading Operations

#### Seat Management
- `requestSeat(market, mint, trader)`: Request a trading seat
- `approveSeat(market, mint, trader)`: Approve a seat request
- `allocateSeat(market, mint, trader)`: Allocate a seat to a trader
- `getSeat(market, mint, trader)`: Get seat information
- `getAllSeatsForTrader(trader)`: Get all seats for a specific trader
- `getAllSeats()`: Get all seats

#### Position Management
- `getTraderPosition(marketPublicKey, trader)`: Get trader's position
- `getAllSeatsForTrader(trader)`: Get all seats for a trader

### Lending and Borrowing Operations

#### Core Operations
- `deposit(market, mint, amount)`: Deposit tokens
- `depositIx(market, mint, amount)`: Get deposit instruction
- `withdraw(market, mint, amount, preInstructions?)`: Withdraw tokens
- `lend(market, mint, amount)`: Lend tokens
- `borrow(market, mint, amount, preInstructions?)`: Borrow tokens
- `repay(market, mint, amount)`: Repay borrowed tokens
- `repayIx(market, mint, amount)`: Get repay instruction
- `markAsCollateral(market, mint, amount)`: Mark tokens as collateral

#### UI-Friendly Operations
- `depositWithUI(config, amount)`: UI-friendly deposit
- `withdrawWithUI(config, amount)`: UI-friendly withdraw
- `lendWithUI(config, amount)`: UI-friendly lend
- `borrowWithUI(config, amount)`: UI-friendly borrow
- `borrowWithCollateralUI(config, amount, collateralAmount)`: UI-friendly borrow with collateral
- `repayWithUI(config, amount)`: UI-friendly repay
- `repayAndWithdrawCollateralWithUI(config, amount)`: UI-friendly repay and withdraw collateral
- `markAsCollateralWithUI(config, amount)`: UI-friendly mark as collateral

### Utility Functions

#### Calculations
- `calculateRemainingBorrowCapacity(priceData, collateralAmount, borrowedAmount)`: Calculate remaining borrow capacity
- `calculateRequiredCollateral(priceData, desiredBorrowAmount)`: Calculate required collateral
- `calculateUSDValue(amount, price, decimals)`: Calculate USD value

#### PDAs (Program Derived Addresses)
- `getMarketHeaderPda(market, mint)`: Get market header PDA
- `getMarketVaultPda(market, mint)`: Get market vault PDA
- `getSeatPda(marketHeader, trader)`: Get seat PDA
### Local Setup

1. Clone this repository
2. Install dependencies
3. Configure your environment for devnet
4. Run the test suite

### Testing

The repository includes comprehensive tests for all protocol functions. To run tests:

```bash
npm run test
```



## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/PaystreamFinance/paystream-t3/blob/main/License.md) file for details.
