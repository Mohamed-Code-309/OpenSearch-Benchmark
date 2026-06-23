import { Module } from '@nestjs/common';
import { BenchmarkController } from './benchmark.controller';
import { BenchmarkService } from './benchmark.service';
import { PostgresRunner } from './runners/postgres.runner';
import { OpenSearchRunner } from './runners/opensearch.runner';
import { ExactMatchScenario } from './scenarios/exact-match.scenario';
import { FuzzyMatchScenario } from './scenarios/fuzzy-match.scenario';
import { PartialMatchScenario } from './scenarios/partial-match.scenario';
import { MultiFieldScenario } from './scenarios/multi-field.scenario';
import { BenchmarkReportService } from './reports/benchmark-report.service';
import { SearchEngineModule } from '../search-engine/search-engine.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [SearchEngineModule, MetricsModule],
  controllers: [BenchmarkController],
  providers: [
    BenchmarkService,
    PostgresRunner,
    OpenSearchRunner,
    ExactMatchScenario,
    FuzzyMatchScenario,
    PartialMatchScenario,
    MultiFieldScenario,
    BenchmarkReportService,
  ],
})
export class BenchmarkModule {}
