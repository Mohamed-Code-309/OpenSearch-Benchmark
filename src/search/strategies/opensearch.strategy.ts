import { Injectable } from '@nestjs/common';
import { SearchStrategy } from './search-strategy.interface';
import { SearchQueryDto } from '../dto/search-query.dto';
import { SearchResult } from '../../common/interfaces/search-result.interface';
import { OpenSearchService } from '../../search-engine/opensearch/opensearch.service';

@Injectable()
export class OpenSearchStrategy implements SearchStrategy {
  constructor(private readonly openSearchService: OpenSearchService) {}

  async search(query: SearchQueryDto): Promise<SearchResult> {
    return this.openSearchService.search(
      'products',
      query.query,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }
}
