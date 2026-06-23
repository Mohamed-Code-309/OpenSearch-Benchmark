import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryCollector {
  private startHeapUsed: number;

  start(): void {
    this.startHeapUsed = process.memoryUsage().heapUsed;
  }

  stop(): number {
    return process.memoryUsage().heapUsed - this.startHeapUsed;
  }
}
