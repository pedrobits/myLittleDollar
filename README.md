# MyLittleDollar 💱

## Overview

A NestJS-based currency conversion microservice that provides real-time exchange rate conversions between multiple currencies.

## Features

- Convert between multiple currency pairs
- Support for traditional and cryptocurrency conversions
- Real-time exchange rate fetching
- Input validation
- Error handling

## Technologies

- NestJS
- TypeScript
- class-validator
- RxJS
- Axios

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Installation

```bash
git clone https://github.com/pedrobits/myLittleDollar.git
cd meupequenodollar
npm install
```

## Running the Application

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

## API Endpoints

### Currency Conversion

`POST /convert`

Request Body:

```json
{
  "baseCurrency": "USD",
  "targetCurrency": "BRL", 
  "amount": 100
}
```

## Supported Currencies

- USD (US Dollar)
- BRL (Brazilian Real)
- EUR (Euro)
- BTC (Bitcoin)
- And more! (Check `src/constants/currency.ts`)

## External API

Uses [AwesomeAPI](https://economia.awesomeapi.com.br/) for real-time exchange rates

## Author

[@pedrobits](https://github.com/pedrobits)
