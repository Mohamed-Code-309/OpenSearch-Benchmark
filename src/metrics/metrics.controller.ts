import { Controller, Get, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  findAll() {
    return this.metricsService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.metricsService.getSummary();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  clear() {
    return this.metricsService.clear();
  }
}
