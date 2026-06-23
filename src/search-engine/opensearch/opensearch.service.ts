import { Injectable, Inject } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { OPENSEARCH_CLIENT } from './opensearch.client';
import { SearchResult } from '../../common/interfaces/search-result.interface';
import { SearchEngine } from '../../common/enums/search-engine.enum';

@Injectable()
export class OpenSearchService {
  constructor(@Inject(OPENSEARCH_CLIENT) private readonly client: Client) {}

  async indexDocument(index: string, id: string, body: Record<string, any>): Promise<void> {
    await this.client.index({ index, id, body, refresh: 'wait_for' });
  }

  async search(
    index: string,
    query: string,
    page = 1,
    limit = 10,
  ): Promise<SearchResult> {
    const start = Date.now();

    const response = await this.client.search({
      index,
      body: {
        from: (page - 1) * limit,
        size: limit,
        query: {
          multi_match: {
            query,
            fields: ['name', 'description', 'category'],
            fuzziness: 'AUTO',
          },
        },
      },
    });

    const hits = response.body.hits;
    return {
      engine: SearchEngine.OPENSEARCH,
      tookMs: Date.now() - start,
      total: typeof hits.total === 'number' ? hits.total : hits.total.value,
      data: hits.hits.map((h: any) => h._source),
    };
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    await this.client.delete({ index, id, refresh: 'wait_for' });
  }

  async createIndex(index: string, settings: Record<string, any>): Promise<void> {
    const exists = await this.indexExists(index);
    if (!exists) {
      await this.client.indices.create({ index, body: settings });
    }
  }

  async indexExists(index: string): Promise<boolean> {
    const response = await this.client.indices.exists({ index });
    return response.statusCode === 200;
  }
}
