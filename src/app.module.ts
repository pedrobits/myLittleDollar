import { Module } from '@nestjs/common';
import { CotacaoModule } from './cotacao/price.module';

@Module({
  imports: [CotacaoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}