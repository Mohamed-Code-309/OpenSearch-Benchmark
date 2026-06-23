import { Injectable } from '@nestjs/common';

@Injectable()
export class CpuCollector {
  private startUsage: NodeJS.CpuUsage;

  start(): void {
    this.startUsage = process.cpuUsage();
  }

  stop(): number {
    const diff = process.cpuUsage(this.startUsage);
    return (diff.user + diff.system) / 1_000;
  }
}
