# OpenSearch-Benchmark
Utilize OpenSearch to enhance search performance and efficiency compared to the current database-based approach (PostgreSQL), while reducing load on backend services. Define and track key metrics to evaluate performance and system impact, and benchmark results against the existing database search to ensure measurable improvement.



## Project Structure
```
opensearch-benchmark/                             ← project root
│
├── seeder.ts                                     ← standalone seeding entry point (no HTTP server)
│
└── src/
│   │
│   ├── main.ts                                   ← normal NestJS application entry point
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── common/                                   ← shared utilities used across modules
│   │   │
│   │   ├── config/
│   │   │   └── benchmark.config.ts               ← benchmark-specific settings (currently unused)
│   │   │
│   │   ├── enums/                                ← shared enums
│   │   │   ├── search-engine.enum.ts             ← POSTGRES | OPENSEARCH
│   │   │   └── benchmark-type.enum.ts
│   │   │
│   │   ├── interfaces/                           ← shared contracts
│   │   │   ├── search-result.interface.ts
│   │   │   └── benchmark-result.interface.ts
│   │   │
│   │   └── constants/
│   │       └── benchmark.constants.ts            ← currently unused
│   │
│   ├── products/                                 ← source-of-truth domain (PostgreSQL)
│   │   │
│   │   ├── products.module.ts
│   │   ├── products.controller.ts                ← stub, handlers not implemented
│   │   ├── products.service.ts                   ← stub, CRUD not implemented
│   │   ├── product-catalog.ts                    ← static product data source used for seeding
│   │   ├── product.seeder.ts                     ← generates products + indexes them into OpenSearch
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
│   ├── sync/                                     ← intended to keep OpenSearch in sync with Postgres
│   │   ├── sync.module.ts
│   │   ├── sync.service.ts                       ← stub, methods not implemented
│   │   └── opensearch.index.ts                   ← index config, currently unused
│   │
│   ├── metrics/                                  ← collects performance data
│   │   │
│   │   ├── metrics.module.ts
│   │   ├── metrics.service.ts                    ← stores metrics
│   │   ├── metrics.controller.ts                 ← exposes metrics APIs
│   │   │
│   │   ├── entities/
│   │   │   └── metrics.entity.ts                 ← persisted benchmark results
│   │   │
│   │   ├── collectors/
│   │   │   ├── latency.collector.ts             ← response time collection
│   │   │   ├── cpu.collector.ts                 ← CPU usage collection
│   │   │   └── memory.collector.ts              ← memory usage collection
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

## Flow
1. **Seed** — `npm run seed -- <count> <batchSize>` generates fake products and writes them to both Postgres and OpenSearch.
2. **Benchmark** — `POST /benchmark/run` executes the requested scenarios against the requested engines, persists each run's metrics, and returns an immediate comparison report.
3. **Analyze** — `GET /metrics/summary` aggregates all persisted runs (avg/p95 latency, avg CPU, avg memory) grouped by engine and scenario type.
4. **Reset** — `DELETE /metrics` clears stored metrics so the next seed/benchmark cycle starts clean.

## Scenarios
Each scenario is a different style of search query, so the benchmark can show where OpenSearch helps the most.

| Scenario | What it tests | Example query → Expected match |
|---|---|---|
| **Exact Match** | A search term that matches a product exactly | `"Wireless Headphones"` → `"Wireless Headphones"` |
| **Fuzzy Match** | Typos / misspellings — does the engine still find the right product? | `"Wireles Headphone"` → `"Wireless Headphones"` |
| **Partial Match** | A single incomplete word | `"Wireless"` → `"Wireless Headphones"` |
| **Multi-Field** | Several unrelated keywords that together span multiple fields (name, category, description) | `"electronics headphones"` → `"Wireless Headphones"` (category: Electronics) |

**How __PostgreSQL__ searches:** a single `ILIKE '%query%'` substring check, repeated across the name, description, and category columns.

- ✅ **Exact Match** — works, the term is a literal substring of the name.
- ✅ **Partial Match** — works, same reason.
- ❌ **Fuzzy Match** — fails. `ILIKE` has no typo tolerance, so a misspelled word won't match.
- ❌ **Multi-Field** — fails. Each column is checked against the *whole* query string, so words that are split across columns (e.g. "electronics" in category, "headphones" in name) never match.

When PostgreSQL "fails" here it returns **zero results**, not wrong ones — the product exists, it just can't be found with a plain substring check.

**How __OpenSearch__ searches:** OpenSearch's `multi_match` query with `fuzziness: AUTO` handles all four cases, which is why the biggest difference between the two engines shows up in **Fuzzy Match** and **Multi-Field** — not just in speed, but in whether the right product is found at all.

## How `/benchmark/run` Works
1. **Controller** receives the request (`engines`, `types`, optional `iterations`, optional `query`), validated against `BenchmarkRequestDto`.
2. **BenchmarkService** picks the scenario for each requested type and repeats its queries `iterations` times. If `query` is set, that single string is used instead of the scenario's canned queries — for every type in the request.
3. For each requested engine, the matching **Runner** (`PostgresRunner` / `OpenSearchRunner`) runs every query one by one — starting the latency/CPU/memory collectors right before the search call and stopping them right after.
4. Each individual query result is saved immediately to the `metrics` table via **MetricsService**.
5. Once everything has run, **BenchmarkReportService** summarizes both engines' results (avg/p95/min/max latency, avg CPU, avg memory) and picks a `winner` based on average latency.
6. The response returns `{ postgres, opensearch, winner }`.

```
Client
  └─ POST /benchmark/run
       └─ BenchmarkController.run()
            └─ BenchmarkService.run()
                 ├─ pick scenario(s) → query list
                 ├─ for each engine:
                 │     └─ Runner.run(queries)
                 │           ├─ start collectors (latency/cpu/memory)
                 │           ├─ call SearchService (Postgres or OpenSearch)
                 │           ├─ stop collectors → build BenchmarkResult
                 │           └─ MetricsService.save() → metrics table
                 └─ BenchmarkReportService.generate(allResults)
                       ├─ summarize per engine
                       └─ pick winner
       └─ returns { postgres, opensearch, winner }
```

## Benchmark Result
Every benchmark run returns one summary block per engine, like this:

```json
{
  "totalQueries": 15,
  "avgLatencyMs": 24.79,
  "p95LatencyMs": 45.62,
  "minLatencyMs": 20.17,
  "maxLatencyMs": 45.62,
  "avgCpuMs": 2.07,
  "avgMemoryMb": 0.0253
}
```

| Field | Meaning | How it's measured |
|---|---|---|
| `totalQueries` | How many queries were run to produce this summary | Just a count of the runs included |
| `avgLatencyMs` | Average response time per query, in milliseconds — lower is better | A timer starts right before the query is sent and stops right after the result comes back; all the individual times are averaged |
| `p95LatencyMs` | 95% of queries were at least this fast; only the slowest 5% took longer — lower is better | All individual query times are sorted, then the value at the 95th percentile is picked |
| `minLatencyMs` / `maxLatencyMs` | Fastest and slowest single query in the run | The smallest and largest values from that same sorted list of query times |
| `avgCpuMs` | Average CPU time spent per query — lower means less load on the backend | Node's CPU usage counter is read before and after each query; the difference is the CPU time that query consumed, then averaged |
| `avgMemoryMb` | Average extra memory used per query, in megabytes | Node's memory usage is read before and after each query; the difference is the extra memory that query allocated, then averaged |

The full response contains one of these blocks for `postgres` and one for `opensearch`, plus a `winner` field stating which engine was faster and by how much.