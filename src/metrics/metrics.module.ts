import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsEntity } from './entities/metrics.entity';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { LatencyCollector } from './collectors/latency.collector';
import { CpuCollector } from './collectors/cpu.collector';
import { MemoryCollector } from './collectors/memory.collector';

@Module({
  imports: [TypeOrmModule.forFeature([MetricsEntity])],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    LatencyCollector,
    CpuCollector,
    MemoryCollector,
  ],
  exports: [
    MetricsService,
    LatencyCollector,
    CpuCollector,
    MemoryCollector,
  ],
})
export class MetricsModule {}
