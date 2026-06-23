import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SearchEngineModule } from '../search-engine/search-engine.module';

@Module({
  imports: [SearchEngineModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
