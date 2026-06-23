import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsEntity } from './entities/metrics.entity';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsInterceptor } from './metrics.interceptor';
import { LatencyCollector } from './collectors/latency.collector';
import { CpuCollector } from './collectors/cpu.collector';
import { MemoryCollector } from './collectors/memory.collector';
import { ResultCountCollector } from './collectors/result-count.collector';

@Module({
  imports: [TypeOrmModule.forFeature([MetricsEntity])],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    MetricsInterceptor,
    LatencyCollector,
    CpuCollector,
    MemoryCollector,
    ResultCountCollector,
  ],
  exports: [
    MetricsService,
    MetricsInterceptor,
    LatencyCollector,
    CpuCollector,
    MemoryCollector,
    ResultCountCollector,
  ],
})
export class MetricsModule {}
