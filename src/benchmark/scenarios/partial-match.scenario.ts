import { Injectable } from '@nestjs/common';

@Injectable()
export class PartialMatchScenario {
  readonly name = 'partial-match';

  getQueries(): string[] {
    return [
      'Wireless',
      'Running',
      'Coffee',
      'Yoga',
      'Laptop',
    ];
  }
}
