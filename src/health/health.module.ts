import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SearchEngineModule } from '../search-engine/search-engine.module';

@Module({
  imports: [SearchEngineModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
