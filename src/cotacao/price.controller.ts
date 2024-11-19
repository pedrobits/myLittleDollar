import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CotacaoService } from './price.service';
import { ConvertValueDto } from "./dto/converteValueDto";

@Controller('currency')
export class cotacaoController {
	constructor(private readonly cotacaoService: CotacaoService) { }

	@Post('convert')
	convertValueTo(@Body() convertValueDto: ConvertValueDto) {
	  const { baseCurrency, targetCurrency, value } = convertValueDto;
	  return this.cotacaoService.convertValueTo(baseCurrency, targetCurrency, value);
	}

	@Get('possibilities')
	getCurrencyPairPossibilities() {
	  return this.cotacaoService.getCurrencyPairPossibilities();
	}
}