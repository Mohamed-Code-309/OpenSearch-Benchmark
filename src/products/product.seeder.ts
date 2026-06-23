import { DataSource, Repository } from 'typeorm';
import { Client } from '@opensearch-project/opensearch';
import { Product } from './entities/product.entity';
import { PRODUCT_CATALOG } from './product-catalog';

const PRODUCTS_INDEX = 'products';

export class ProductSeeder {
  private readonly repository: Repository<Product>;
  private readonly osClient: Client;

  constructor(
    private readonly dataSource: DataSource,
    osClient: Client,
  ) {
    this.repository = dataSource.getRepository(Product);
    this.osClient = osClient;

  }

  async seed(count: number, batchSize: number): Promise<void> {
    console.log(`Seeding ${count} products in batches of ${batchSize}...`);

    for (let seeded = 0; seeded < count; seeded += batchSize) {
      const batchCount = Math.min(batchSize, count - seeded);

      const batch = Array.from({ length: batchCount }, () =>
        this.buildProduct(),
      );

      //postgres
      const inserted = await this.repository.save(batch);

      //openSearch
      await this.bulkIndex(inserted);

      console.log(`Inserted ${seeded + batchCount} / ${count}`);
    }

    console.log('Seeding complete.');
  }

  private buildProduct(): Partial<Product> {
    const categories = Object.keys(PRODUCT_CATALOG);

    const category =
      categories[Math.floor(Math.random() * categories.length)];

    const catalog = PRODUCT_CATALOG[category];

    const name =
      catalog.products[
      Math.floor(Math.random() * catalog.products.length)
      ];

    const description =
      catalog.descriptions[
      Math.floor(Math.random() * catalog.descriptions.length)
      ];

    const tagCount = Math.floor(Math.random() * 3) + 2; // 2-4 tags

    const tags = [...catalog.tags]
      .sort(() => Math.random() - 0.5)
      .slice(0, tagCount);

    return {
      name,
      description,
      category,
      tags,
      price: Number((Math.random() * 5000 + 10).toFixed(2)),
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ),
    };
  }

  private async bulkIndex(products: Product[]): Promise<void> {
    const body = products.flatMap((p) => [
      { index: { _index: PRODUCTS_INDEX, _id: p.id } },
      {
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        tags: p.tags,
        price: p.price,
        createdAt: p.createdAt,
      },
    ]);

    await this.osClient.bulk({
      refresh: true,
      body,
    });
  }
}