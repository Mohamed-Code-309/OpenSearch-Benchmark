import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
//dotenv.config() must run before any process.env , cause ts-node doesn't load .env files automatically.
import { DataSource } from 'typeorm';
import { Client } from '@opensearch-project/opensearch';
import { Product } from './src/products/entities/product.entity';
import { ProductSeeder } from './src/products/product.seeder';

const args = process.argv.slice(2);
const count = Number(args[0] ?? 1000);
const batchSize = Number(args[1] ?? 100);

if (isNaN(count) || isNaN(batchSize)) {
  throw new Error('Invalid arguments. Use: npm run seed -- <count> <batchSize>');
}

async function bootstrap() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Product]
  });

  await dataSource.initialize();

  const osClient = new Client({
    node: process.env.OPENSEARCH_NODE ?? 'http://localhost:9200',
    ...(process.env.OPENSEARCH_USERNAME && process.env.OPENSEARCH_PASSWORD
      ? { auth: { username: process.env.OPENSEARCH_USERNAME, password: process.env.OPENSEARCH_PASSWORD } }
      : {}),
    ssl: { rejectUnauthorized: false },
  });

  const seeder = new ProductSeeder(dataSource, osClient);

  await seeder.seed(count, batchSize);

  await dataSource.destroy();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
