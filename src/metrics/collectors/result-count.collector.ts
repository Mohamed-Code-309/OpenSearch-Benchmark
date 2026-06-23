import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultCountCollector {
  collect(results: unknown[]): number {
    return results.length;
  }
}
