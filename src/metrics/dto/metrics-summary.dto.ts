import { SearchEngine } from '../../common/enums/search-engine.enum';
import { BenchmarkType } from '../../common/enums/benchmark-type.enum';

export class MetricsSummaryDto {
  engine: SearchEngine;
  benchmarkType: BenchmarkType;
  avgLatencyMs: number;
  p95LatencyMs: number;
  avgCpuUsage: number;
  avgMemoryUsageMb: number;
  totalRuns: number;
}
