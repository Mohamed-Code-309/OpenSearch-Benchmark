import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { TRACK_METRICS_KEY } from '../common/decorators/track-metrics.decorator';
import { MetricsService } from './metrics.service';
import { LatencyCollector } from './collectors/latency.collector';
import { CpuCollector } from './collectors/cpu.collector';
import { MemoryCollector } from './collectors/memory.collector';
import { ResultCountCollector } from './collectors/result-count.collector';
import { SearchEngine } from '../common/enums/search-engine.enum';
import { BenchmarkType } from '../common/enums/benchmark-type.enum';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly metricsService: MetricsService,
    private readonly latency: LatencyCollector,
    private readonly cpu: CpuCollector,
    private readonly memory: MemoryCollector,
    private readonly resultCount: ResultCountCollector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const shouldTrack = this.reflector.get<boolean>(
      TRACK_METRICS_KEY,
      context.getHandler(),
    );

    if (!shouldTrack) return next.handle();

    const request = context.switchToHttp().getRequest();
    const engine: SearchEngine = request.query?.engine ?? SearchEngine.POSTGRES;
    const benchmarkType: BenchmarkType = request.query?.type ?? BenchmarkType.EXACT_MATCH;

    this.latency.start();
    this.cpu.start();
    this.memory.start();

    return next.handle().pipe(
      tap((response: any) => {
        const latencyMs = this.latency.stop();
        const cpuUsage = this.cpu.stop();
        const memoryUsageMb = this.memory.stop() / 1_048_576;
        const count = this.resultCount.collect(response?.data ?? []);

        this.metricsService.save({
          engine,
          type: benchmarkType,
          latencyMs,
          cpuUsage,
          memoryUsageMb,
          resultCount: count,
          timestamp: new Date(),
        });
      }),
    );
  }
}
