import { SearchEngine } from '../enums/search-engine.enum';
import { BenchmarkType } from '../enums/benchmark-type.enum';

export interface BenchmarkResult {
  engine: SearchEngine;
  type: BenchmarkType;
  latencyMs: number;
  cpuUsage: number;
  memoryUsageMb: number;
  resultCount: number;
  timestamp: Date;
}
