import { Injectable } from '@nestjs/common';
import { BenchmarkResult } from '../../common/interfaces/benchmark-result.interface';
import { BenchmarkType } from '../../common/enums/benchmark-type.enum';
import { SearchEngine } from '../../common/enums/search-engine.enum';
import { PostgresSearchService } from '../../search-engine/postgres/postgres-search.service';
import { LatencyCollector } from '../../metrics/collectors/latency.collector';
import { CpuCollector } from '../../metrics/collectors/cpu.collector';
import { MemoryCollector } from '../../metrics/collectors/memory.collector';

@Injectable()
export class PostgresRunner {
  constructor(
    private readonly postgresSearchService: PostgresSearchService,
    private readonly latency: LatencyCollector,
    private readonly cpu: CpuCollector,
    private readonly memory: MemoryCollector,
  ) {}

  async run(queries: string[], type: BenchmarkType): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    for (const query of queries) {
      this.latency.start();
      this.cpu.start();
      this.memory.start();

      const result = await this.postgresSearchService.search(query);

      results.push({
        engine: SearchEngine.POSTGRES,
        type,
        latencyMs: this.latency.stop(),
        cpuUsage: this.cpu.stop(),
        memoryUsageMb: this.memory.stop() / 1_048_576,
        resultCount: result.total,
        timestamp: new Date(),
      });
    }

    return results;
  }
}
