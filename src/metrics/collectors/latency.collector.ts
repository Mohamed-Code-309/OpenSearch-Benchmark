import { Injectable } from '@nestjs/common';

@Injectable()
export class LatencyCollector {
  private startTime: bigint;

  start(): void {
    this.startTime = process.hrtime.bigint();
  }

  stop(): number {
    const diffNs = process.hrtime.bigint() - this.startTime;
    return Number(diffNs) / 1_000_000;
  }
}
