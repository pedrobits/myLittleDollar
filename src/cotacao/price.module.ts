import { Module } from "@nestjs/common";
import { CotacaoService } from "./price.service";
import { cotacaoController } from "./price.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	controllers: [cotacaoController],
	providers: [CotacaoService],
})
export class CotacaoModule { }