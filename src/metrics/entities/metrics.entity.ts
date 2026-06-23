import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SearchEngine } from '../../common/enums/search-engine.enum';
import { BenchmarkType } from '../../common/enums/benchmark-type.enum';

@Entity('metrics')
export class MetricsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: SearchEngine })
  engine: SearchEngine;

  @Column({ type: 'enum', enum: BenchmarkType })
  benchmarkType: BenchmarkType;

  @Column('float')
  latencyMs: number;

  @Column('float')
  cpuUsage: number;

  @Column('float')
  memoryUsageMb: number;

  @Column('int')
  resultCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
