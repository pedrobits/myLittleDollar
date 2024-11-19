import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";
import { CotacaoService } from './price.service';
import { ConvertValueDto } from "./dto/converteValueDto";

@Controller()
export class cotacaoController {
	constructor(private readonly cotacaoService: CotacaoService) { }

	@Post('convert')
	convertValueTo(@Body() convertValueDto: ConvertValueDto) {
	  const { baseCurrency, targetCurrency, amount } = convertValueDto;
	  return this.cotacaoService.convertValueTo(baseCurrency, targetCurrency, amount);
	}
}