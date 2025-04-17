# Paystream-devnet P2P Engine

[![Paystream Protocol](https://img.shields.io/badge/Paystream-Protocol-blue)](https://testnet.paystream.finance/optimizers/marginfi)
[![Devnet](https://img.shields.io/badge/Network-Devnet-orange)](https://solana.com/)

## Overview

Paystream is a peer-to-peer lending protocol built on Solana that allows users to lend and borrow assets directly. This repository contains the development environment and tools necessary to interact with the Paystream protocol on Solana's devnet.




## Demo

Check out our live demo: [Paystream Devnet Engine](https://testnet.paystream.finance/optimizers/marginfi)

https://github.com/user-attachments/assets/6b950061-0c0c-47ca-8744-e5c4cc15c710

## Getting Started

### Prerequisites

- Solana wallet (e.g., Phantom, Solflare)
- Basic understanding of DeFi lending protocols
- Familiarity with Solana blockchain

### Devnet Access

To interact with the Paystream protocol on devnet, use the following whitelisted wallet:

**Secret Key:**
```
9fGzRVVoVQRRnPPZtpSqjt5t7fRtfg5ooh5tYqgqe3zkmALiaFiUTcwk67mT3uCJ6fhRbPjXmTuSmX8SpkKP7N7
```

**Important:** Ensure that the network in your wallet is set to **Devnet**. This wallet has been pre-funded with devnet tokens for testing purposes.

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

## Architecture Diagrams

[View Protocol Architecture Diagrams ](https://maushish-guide.notion.site/Paystream-14fe89e3279f80c883f5e12574e00922?pvs=74)

## Technical Documentation

The protocol documentation is available in the `/docs` directory of this repository. Key components include:

- Market architecture
- Lending/borrowing mechanisms
- Interest rate models
- Liquidation procedures
- Security features

## Development

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
