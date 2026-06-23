import { Injectable } from '@nestjs/common';
import { SearchStrategy } from './search-strategy.interface';
import { SearchQueryDto } from '../dto/search-query.dto';
import { SearchResult } from '../../common/interfaces/search-result.interface';
import { PostgresSearchService } from '../../search-engine/postgres/postgres-search.service';

@Injectable()
export class PostgresStrategy implements SearchStrategy {
  constructor(private readonly postgresSearchService: PostgresSearchService) {}

  async search(query: SearchQueryDto): Promise<SearchResult> {
    return this.postgresSearchService.search(
      query.query,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }
}
