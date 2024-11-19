import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { currencyPairs } from "../constants/currency";
import { currencySymbols } from "../constants/currencySymbol";
import { lastValueFrom } from "rxjs";

@Injectable()
export class CotacaoService {
	constructor(private readonly httpService: HttpService) { }

	async convertValueTo(baseCurrency: string, targetCurrency: string, amount: number): Promise<any> {
		try {
			const currencyPair = await this.isCurrencyPairValid(baseCurrency, targetCurrency);
			if (!currencyPair) {
				throw new Error(`Currency pair not found: ${baseCurrency}-${targetCurrency}`);
			}

			const convertValueToNewCurrency = await this.fetchCurrencyConvertedValue(currencyPair);

			const actualPair = Object.keys(convertValueToNewCurrency)[0];
			const isReversed = actualPair !== `${baseCurrency}${targetCurrency}`;

			const exchangeRate = parseFloat(
				isReversed
					? convertValueToNewCurrency[actualPair]?.ask
					: convertValueToNewCurrency[actualPair]?.bid
			);

			if (!exchangeRate) {
				throw new Error(`Exchange rate not found for ${currencyPair}`);
			}
			return {
				[`${baseCurrency}Entry`]: {
					currencySymbol: currencySymbols[baseCurrency],
					Value: amount,
				},
				convertedValue: {
					CurrencySymbol: currencySymbols[targetCurrency],
					Value: isReversed
						? amount / exchangeRate
						: amount * exchangeRate,
				},
				date: this.getFormattedDate(convertValueToNewCurrency[actualPair].create_date),
				exchangeRate: `${exchangeRate.toFixed(2)}%`,
			};
		} catch (error) {
			console.error(`Erro ao buscar cotação ${baseCurrency}-${targetCurrency}:`, error.message);
			throw new NotAcceptableException(`Falha ao obter a cotação ${baseCurrency}-${targetCurrency}.`);
		}
	}

	private async isCurrencyPairValid(baseCurrency: string, targetCurrency: string): Promise<string | null> {
		const directPair = `${baseCurrency}-${targetCurrency}`;
		const reversePair = `${targetCurrency}-${baseCurrency}`;

		if (currencyPairs.includes(directPair)) {
			return directPair;
		}
		if (currencyPairs.includes(reversePair)) {
			return reversePair;
		}

		return null;
	}

	private getFormattedDate(entryDate: Date): string {
		return new Date(entryDate).toLocaleDateString("pt-BR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	}

	private async fetchCurrencyConvertedValue(currencyPair: string): Promise<any> {
		try {
			const response = await lastValueFrom(
				this.httpService.get(`https://economia.awesomeapi.com.br/json/last/${currencyPair}`)
			);
			return response.data;
		} catch (error) {
			console.error(`Erro ao buscar dados da API para o par de moedas ${currencyPair}:`, error.message);
			throw new HttpException(
				`Não foi possível buscar os dados para o par de moedas ${currencyPair}. Tente novamente mais tarde.`,
				HttpStatus.SERVICE_UNAVAILABLE
			);
		}
	}
}