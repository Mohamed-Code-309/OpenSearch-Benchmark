import { Injectable } from '@nestjs/common';

@Injectable()
export class ExactMatchScenario {
  readonly name = 'exact-match';

  getQueries(): string[] {
    return [
      'Wireless Headphones',
      'Running Shoes',
      'Coffee Maker',
      'Yoga Mat',
      'Laptop Stand',
    ];
  }
}
