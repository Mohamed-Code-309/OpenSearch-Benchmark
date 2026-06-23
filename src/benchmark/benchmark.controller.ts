import { Controller, Post, Body } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { BenchmarkRequestDto } from './dto/benchmark-request.dto';

@Controller('benchmark')
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @Post('run')
  run(@Body() dto: BenchmarkRequestDto) {
    return this.benchmarkService.run(dto);
  }
}
