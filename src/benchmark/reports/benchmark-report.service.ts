import { Injectable } from '@nestjs/common';
import { BenchmarkResult } from '../../common/interfaces/benchmark-result.interface';
import { SearchEngine } from '../../common/enums/search-engine.enum';

@Injectable()
export class BenchmarkReportService {
  generate(results: BenchmarkResult[]): Record<string, unknown> {
    const postgres = results.filter((r) => r.engine === SearchEngine.POSTGRES);
    const opensearch = results.filter((r) => r.engine === SearchEngine.OPENSEARCH);

    return {
      postgres: this.summarize(postgres),
      opensearch: this.summarize(opensearch),
      winner: this.pickWinner(postgres, opensearch),
    };
  }

  private summarize(results: BenchmarkResult[]) {
    if (!results.length) return null;

    const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
    const p95Index = Math.floor(latencies.length * 0.95);

    return {
      totalQueries: results.length,
      avgLatencyMs: +(latencies.reduce((s, v) => s + v, 0) / latencies.length).toFixed(2),
      p95LatencyMs: +(latencies[p95Index] ?? latencies[latencies.length - 1]).toFixed(2),
      minLatencyMs: +latencies[0].toFixed(2),
      maxLatencyMs: +latencies[latencies.length - 1].toFixed(2),
      avgCpuMs: +(results.reduce((s, r) => s + r.cpuUsage, 0) / results.length).toFixed(2),
      avgMemoryMb: +(results.reduce((s, r) => s + r.memoryUsageMb, 0) / results.length).toFixed(4),
      totalResultCount: results.reduce((s, r) => s + r.resultCount, 0),
    };
  }

  private pickWinner(postgres: BenchmarkResult[], opensearch: BenchmarkResult[]) {
    if (!postgres.length || !opensearch.length) return 'N/A';
    const pgAvg = postgres.reduce((s, r) => s + r.latencyMs, 0) / postgres.length;
    const osAvg = opensearch.reduce((s, r) => s + r.latencyMs, 0) / opensearch.length;
    const diff = (((pgAvg - osAvg) / pgAvg) * 100).toFixed(1);
    return osAvg < pgAvg
      ? `OPENSEARCH is ${diff}% faster`
      : `POSTGRES is ${(((osAvg - pgAvg) / osAvg) * 100).toFixed(1)}% faster`;
  }
}
