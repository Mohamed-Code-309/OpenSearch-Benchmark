import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SearchEngineModule } from './search-engine/search-engine.module';
import { SearchModule } from './search/search.module';
import { SyncModule } from './sync/sync.module';
import { MetricsModule } from './metrics/metrics.module';
import { BenchmarkModule } from './benchmark/benchmark.module';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { MetricsEntity } from './metrics/entities/metrics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow('DB_USERNAME'),
        password: config.getOrThrow('DB_PASSWORD'),
        database: config.getOrThrow('DB_NAME'),
        entities: [Product, MetricsEntity],
        synchronize: true,
      }),
    }),
    ProductsModule,
    SearchEngineModule,
    SearchModule,
    SyncModule,
    MetricsModule,
    BenchmarkModule,
    HealthModule,
  ],
})
export class AppModule { }
