import { SearchEngine } from "../enums/search-engine.enum";

export interface SearchResult<T = any> {
  engine: SearchEngine.POSTGRES | SearchEngine.OPENSEARCH;
  tookMs: number;
  total: number;
  data: T[];
}