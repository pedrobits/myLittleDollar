import { Module } from '@nestjs/common';
import { CotacaoModule } from './cotacao/price.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CotacaoModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }