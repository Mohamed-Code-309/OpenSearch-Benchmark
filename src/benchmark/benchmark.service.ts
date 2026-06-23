import { Injectable } from '@nestjs/common';
import { BenchmarkRequestDto } from './dto/benchmark-request.dto';
import { PostgresRunner } from './runners/postgres.runner';
import { OpenSearchRunner } from './runners/opensearch.runner';
import { BenchmarkReportService } from './reports/benchmark-report.service';
import { MetricsService } from '../metrics/metrics.service';
import { ExactMatchScenario } from './scenarios/exact-match.scenario';
import { FuzzyMatchScenario } from './scenarios/fuzzy-match.scenario';
import { PartialMatchScenario } from './scenarios/partial-match.scenario';
import { MultiFieldScenario } from './scenarios/multi-field.scenario';
import { BenchmarkType } from '../common/enums/benchmark-type.enum';
import { SearchEngine } from '../common/enums/search-engine.enum';
import { BenchmarkResult } from '../common/interfaces/benchmark-result.interface';

@Injectable()
export class BenchmarkService {
  private readonly scenarioMap: Record<BenchmarkType, { getQueries(): string[] }>;

  constructor(
    private readonly postgresRunner: PostgresRunner,
    private readonly openSearchRunner: OpenSearchRunner,
    private readonly reportService: BenchmarkReportService,
    private readonly metricsService: MetricsService,
    private readonly exactMatch: ExactMatchScenario,
    private readonly fuzzyMatch: FuzzyMatchScenario,
    private readonly partialMatch: PartialMatchScenario,
    private readonly multiField: MultiFieldScenario,
  ) {
    this.scenarioMap = {
      [BenchmarkType.EXACT_MATCH]: this.exactMatch,
      [BenchmarkType.FUZZY_MATCH]: this.fuzzyMatch,
      [BenchmarkType.PARTIAL_MATCH]: this.partialMatch,
      [BenchmarkType.MULTI_FIELD]: this.multiField,
    };
  }

  async run(dto: BenchmarkRequestDto): Promise<Record<string, unknown>> {
    const iterations = dto.iterations ?? 1;
    const allResults: BenchmarkResult[] = [];

    for (const type of dto.types) {
      const scenario = this.scenarioMap[type];
      const queries = dto.query ? [dto.query] : scenario.getQueries();
      const repeated = Array.from({ length: iterations }, () => queries).flat();

      for (const engine of dto.engines) {
        const results = engine === SearchEngine.POSTGRES
          ? await this.postgresRunner.run(repeated, type)
          : await this.openSearchRunner.run(repeated, type);

        for (const result of results) {
          await this.metricsService.save(result);
        }

        allResults.push(...results);
      }
    }

    return this.reportService.generate(allResults);
  }
}
