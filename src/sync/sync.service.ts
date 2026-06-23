import { Injectable } from '@nestjs/common';
import { OpenSearchService } from '../search-engine/opensearch/opensearch.service';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SyncService {
  constructor(private readonly openSearchService: OpenSearchService) {}

  async indexProduct(product: Product): Promise<void> {}

  async removeProduct(id: string): Promise<void> {}

  async reindexAll(products: Product[]): Promise<void> {}
}
