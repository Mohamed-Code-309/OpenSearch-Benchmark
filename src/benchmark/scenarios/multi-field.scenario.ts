import { Injectable } from '@nestjs/common';

@Injectable()
export class MultiFieldScenario {
  readonly name = 'multi-field';

  getQueries(): string[] {
    return [
      'electronics headphones',
      'sports running outdoor',
      'kitchen coffee appliance',
      'fitness yoga wellness',
      'accessories laptop office',
    ];
  }
}
