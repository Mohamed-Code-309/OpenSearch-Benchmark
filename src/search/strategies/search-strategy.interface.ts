import { SearchResult } from '../../common/interfaces/search-result.interface';
import { SearchQueryDto } from '../dto/search-query.dto';

export interface SearchStrategy {
  search(query: SearchQueryDto): Promise<SearchResult>;
}
