import { productMapping } from '../search-engine/opensearch/mappings/product.mapping';
import { productAnalyzer } from '../search-engine/opensearch/analyzers/product.analyzer';

export const productsIndexConfig = {
  ...productAnalyzer,
  ...productMapping,
};
