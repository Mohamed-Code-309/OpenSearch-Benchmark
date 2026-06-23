import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricsEntity } from './entities/metrics.entity';
import { BenchmarkResult } from '../common/interfaces/benchmark-result.interface';
import { MetricsSummaryDto } from './dto/metrics-summary.dto';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(MetricsEntity)
    private readonly metricsRepository: Repository<MetricsEntity>,
  ) {}

  async save(result: BenchmarkResult): Promise<MetricsEntity> {
    const entity = this.metricsRepository.create({
      engine: result.engine,
      benchmarkType: result.type,
      latencyMs: result.latencyMs,
      cpuUsage: result.cpuUsage,
      memoryUsageMb: result.memoryUsageMb,
      resultCount: result.resultCount,
      timestamp: result.timestamp,
    });
    return this.metricsRepository.save(entity);
  }

  async getSummary(): Promise<MetricsSummaryDto[]> {
    const rows = await this.metricsRepository.find({ order: { timestamp: 'DESC' } });

    const groups = new Map<string, MetricsEntity[]>();
    for (const row of rows) {
      const key = `${row.engine}__${row.benchmarkType}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    return Array.from(groups.values()).map((entries) => {
      const latencies = entries.map((e) => e.latencyMs).sort((a, b) => a - b);
      const p95Index = Math.floor(latencies.length * 0.95);

      return {
        engine: entries[0].engine,
        benchmarkType: entries[0].benchmarkType,
        avgLatencyMs: latencies.reduce((s, v) => s + v, 0) / latencies.length,
        p95LatencyMs: latencies[p95Index] ?? latencies[latencies.length - 1],
        avgCpuUsage: entries.reduce((s, e) => s + e.cpuUsage, 0) / entries.length,
        avgMemoryUsageMb: entries.reduce((s, e) => s + e.memoryUsageMb, 0) / entries.length,
        totalRuns: entries.length,
      };
    });
  }

  async findAll(): Promise<MetricsEntity[]> {
    return this.metricsRepository.find({ order: { timestamp: 'DESC' } });
  }

  async clear(): Promise<void> {
    await this.metricsRepository.clear();
  }
}
