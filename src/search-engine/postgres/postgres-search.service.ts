import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { SearchResult } from '../../common/interfaces/search-result.interface';
import { SearchEngine } from '../../common/enums/search-engine.enum';

@Injectable()
export class PostgresSearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<SearchResult> {
    const start = Date.now();

    const [data, total] = await this.productRepository
      .createQueryBuilder('product')
      .where(
        'product.name ILIKE :q OR product.description ILIKE :q OR product.category ILIKE :q',
        { q: `%${query}%` },
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      engine: SearchEngine.POSTGRES,
      tookMs: Date.now() - start,
      total,
      data,
    };
  }
}
