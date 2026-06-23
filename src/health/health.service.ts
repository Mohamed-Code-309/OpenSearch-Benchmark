import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OpenSearchService } from '../search-engine/opensearch/opensearch.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly openSearchService: OpenSearchService,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async checkOpenSearch(): Promise<boolean> {
    try {
      return await this.openSearchService.indexExists('products');
    } catch {
      return false;
    }
  }

  async check(): Promise<{ status: string; postgres: boolean; opensearch: boolean }> {
    const [postgres, opensearch] = await Promise.all([
      this.checkDatabase(),
      this.checkOpenSearch(),
    ]);
    return {
      status: postgres && opensearch ? 'ok' : 'degraded',
      postgres,
      opensearch,
    };
  }
}
