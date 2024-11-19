import { HttpException, HttpStatus, Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { currencyPairs } from "../constants/currency";
import { currencySymbols } from "../constants/currencySymbol";
import { lastValueFrom } from "rxjs";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';

@Injectable()
export class CotacaoService {
	constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

	async convertValueTo(baseCurrency: string, targetCurrency: string, value: number): Promise<any> {
		try {
			const cacheKey = `currency_${baseCurrency}_${targetCurrency}`;
			const cachedData = await this.cacheManager.get(cacheKey) as any;
			if (cachedData) { return cachedData };

			const currencyPair = await this.isCurrencyPairValid(baseCurrency, targetCurrency);
			if (!currencyPair) {
				throw new Error(`Currency pair not found: ${baseCurrency}-${targetCurrency}`);
			}

			const currencyConversionData = await this.fetchCurrencyConvertedValue(currencyPair);

			const actualPair = Object.keys(currencyConversionData)[0];
			const isReversePair = actualPair !== `${baseCurrency}${targetCurrency}`;

			const exchangeRate = parseFloat(
				isReversePair
					? currencyConversionData[actualPair]?.ask
					: currencyConversionData[actualPair]?.bid
			);

			if (!exchangeRate) {
				throw new Error(`Exchange rate not found for ${currencyPair}`);
			}

			const formattedDate = this.getFormattedDate(currencyConversionData[actualPair].create_date);

			const cacheData = {
				[`${baseCurrency}Entry`]: {
					currencySymbol: currencySymbols[baseCurrency],
					Value: value,
				},
				convertedValue: {
					CurrencySymbol: currencySymbols[targetCurrency],
					Value: isReversePair
						? value / exchangeRate
						: value * exchangeRate,
				},
				date: formattedDate,
				exchangeRate: `${exchangeRate}`,
			};

			await this.cacheManager.set(cacheKey, cacheData, 3600000);
			return cacheData;
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

	async getCurrencyPairPossibilities(): Promise<string[]> {
		return currencyPairs;
	}
}