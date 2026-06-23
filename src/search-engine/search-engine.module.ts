import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { OpenSearchService } from './opensearch/opensearch.service';
import { OpenSearchClientProvider } from './opensearch/opensearch.client';
import { PostgresSearchService } from './postgres/postgres-search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [OpenSearchClientProvider, OpenSearchService, PostgresSearchService],
  exports: [OpenSearchService, PostgresSearchService],
})
export class SearchEngineModule {}
