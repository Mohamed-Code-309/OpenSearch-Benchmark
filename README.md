# OpenSearch-Benchmark
Utilize OpenSearch to enhance search performance and efficiency compared to the current database-based approach (PostgreSQL), while reducing load on backend services. Define and track key metrics to evaluate performance and system impact, and benchmark results against the existing database search to ensure measurable improvement.

## Project Structure
```
opensearch-benchmark/                             ← project root
│
├── main.ts                                       ← normal NestJS application entry point
├── seeder.ts                                     ← standalone seeding entry point (no HTTP server)
│
└── src/
│   │
│   ├── common/                                   ← shared utilities used across modules
│   │   │
│   │   ├── config/                               ← environment-based configuration
│   │   │   └── benchmark.config.ts               ← benchmark-specific settings
│   │   │
│   │   ├── enums/                                ← shared enums
│   │   │   ├── search-engine.enum.ts             ← POSTGRES | OPENSEARCH
│   │   │   └── benchmark-type.enum.ts
│   │   │
│   │   ├── interfaces/                           ← shared contracts
│   │   │   ├── search-result.interface.ts
│   │   │   └── benchmark-result.interface.ts
│   │   │
│   │   ├── decorators/
│   │   │   └── track-metrics.decorator.ts        ← marks endpoints for metrics collection
│   │   │
│   │   └── constants/
│   │       └── benchmark.constants.ts
│   │
│   ├── database/                                 ← database-related concerns
│   │   │
│   │   ├── database.module.ts                    ← TypeORM bootstrap
│   │   │
│   │   └── seeders/
│   │       ├── product-catalog.ts                ← static product data source used for seeding
│   │       └── product.seeder.ts                 ← generates and seeds products
│   │
│   ├── products/                                 ← source-of-truth domain (PostgreSQL)
│   │   │
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts                   ← CRUD operations
│   │   ├── product-catalog.ts                    ← static product data source used for seeding
│   │   └── product.seeder.ts                     ← generates and seeds products
│   │
│   │   │
│   │   ├── entities/
│   │   │   └── product.entity.ts                 ← database entity
│   │   │
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   ├── search-engine/                            ← actual search engine implementations
│   │   │
│   │   ├── search-engine.module.ts
│   │   │
│   │   ├── postgres/
│   │   │   └── postgres-search.service.ts        ← PostgreSQL search implementation
│   │   │
│   │   └── opensearch/
│   │       ├── opensearch.client.ts              ← OpenSearch client provider
│   │       ├── opensearch.service.ts             ← OpenSearch operations
│   │       │
│   │       ├── mappings/
│   │       │   └── product.mapping.ts            ← index mapping definition
│   │       │
│   │       └── analyzers/
│   │           └── product.analyzer.ts           ← custom analyzers/tokenizers
│   │
│   │
│   ├── search/                                   ← unified search API layer
│   │   │
│   │   ├── search.module.ts
│   │   ├── search.controller.ts                  ← exposes /search endpoint
│   │   ├── search.service.ts                     ← orchestrates strategies
│   │   │
│   │   ├── dto/
│   │   │   └── search-query.dto.ts
│   │   │
│   │   └── strategies/
│   │       ├── search-strategy.interface.ts      ← common search contract
│   │       ├── postgres.strategy.ts              ← PostgreSQL strategy
│   │       └── opensearch.strategy.ts            ← OpenSearch strategy
│   │
│   ├── sync/
│   │   ├── sync.module.ts
│   │   ├── sync.service.ts                       ← keeps OpenSearch in sync with PG
│   │   └── opensearch.index.ts                   ← index mapping + analyzer config
│   │
│   ├── metrics/                                  ← collects performance data
│   │   │
│   │   ├── metrics.module.ts
│   │   ├── metrics.service.ts                    ← stores metrics
│   │   ├── metrics.controller.ts                 ← exposes metrics APIs
│   │   ├── metrics.interceptor.ts                ← auto-measures requests
│   │   │
│   │   ├── entities/
│   │   │   └── metrics.entity.ts                 ← persisted benchmark results
│   │   │
│   │   ├── collectors/
│   │   │   ├── latency.collector.ts             ← response time collection
│   │   │   ├── cpu.collector.ts                 ← CPU usage collection
│   │   │   ├── memory.collector.ts              ← memory usage collection
│   │   │   └── result-count.collector.ts        ← returned results count
│   │   │
│   │   └── dto/
│   │       └── metrics-summary.dto.ts
│   │
│   ├── benchmark/                                ← benchmark execution & comparison
│   │   │
│   │   ├── benchmark.module.ts
│   │   ├── benchmark.controller.ts               ← exposes /benchmark/run
│   │   ├── benchmark.service.ts                  ← benchmark orchestration
│   │   │
│   │   ├── runners/
│   │   │   ├── postgres.runner.ts                ← executes PG benchmark
│   │   │   └── opensearch.runner.ts              ← executes OS benchmark
│   │   │
│   │   ├── scenarios/
│   │   │   ├── exact-match.scenario.ts           ← exact keyword searches
│   │   │   ├── fuzzy-match.scenario.ts           ← typo tolerance tests
│   │   │   ├── partial-match.scenario.ts         ← partial text searches
│   │   │   └── multi-field.scenario.ts           ← multi-field searches
│   │   │
│   │   ├── reports/
│   │   │   └── benchmark-report.service.ts       ← generates comparison reports
│   │   │
│   │   └── dto/
│   │       └── benchmark-request.dto.ts
│   │
│   └── health/                                   ← infrastructure health checks
│       ├── health.module.ts
│       ├── health.controller.ts
│       └── health.service.ts                     ← PostgreSQL/OpenSearch status
│
├── .env                                          ← local environment variables
├── .env.example                                  ← sample environment variables
└── package.json                                  ← dependencies & scripts
```