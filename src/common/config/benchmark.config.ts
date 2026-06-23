import { registerAs } from '@nestjs/config';

export default registerAs('benchmark', () => ({
  iterations: parseInt(process.env.BENCHMARK_ITERATIONS ?? '100', 10),
  warmupRuns: parseInt(process.env.BENCHMARK_WARMUP_RUNS ?? '10', 10),
  concurrency: parseInt(process.env.BENCHMARK_CONCURRENCY ?? '1', 10),
}));
