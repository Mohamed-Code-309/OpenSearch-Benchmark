import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

export const OPENSEARCH_CLIENT = 'OPENSEARCH_CLIENT';

export const OpenSearchClientProvider: Provider = {
  provide: OPENSEARCH_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Client => {
  const node = config.get<string>('OPENSEARCH_NODE', 'https://localhost:9200');
  const username = config.get<string>('OPENSEARCH_USERNAME');
  const password = config.get<string>('OPENSEARCH_PASSWORD');

    return new Client({
      node,
      ...(username && password ? { auth: { username, password } } : {}),
      ssl: { rejectUnauthorized: false },
    });
  },
};
