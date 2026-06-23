import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PostgresStrategy } from './strategies/postgres.strategy';
import { OpenSearchStrategy } from './strategies/opensearch.strategy';
import { SearchEngineModule } from '../search-engine/search-engine.module';

@Module({
  imports: [SearchEngineModule],
  controllers: [SearchController],
  providers: [SearchService, PostgresStrategy, OpenSearchStrategy],
})
export class SearchModule {}
