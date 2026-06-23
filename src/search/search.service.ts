import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchResult } from '../common/interfaces/search-result.interface';
import { SearchEngine } from '../common/enums/search-engine.enum';
import { PostgresStrategy } from './strategies/postgres.strategy';
import { OpenSearchStrategy } from './strategies/opensearch.strategy';

@Injectable()
export class SearchService {
  constructor(
    private readonly postgresStrategy: PostgresStrategy,
    private readonly openSearchStrategy: OpenSearchStrategy,
  ) { }

  search(query: SearchQueryDto): Promise<SearchResult> {
    if (query.engine === SearchEngine.OPENSEARCH) {
      return this.openSearchStrategy.search(query);
    }
    return this.postgresStrategy.search(query);
  }
}
