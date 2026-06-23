import { Injectable } from '@nestjs/common';

@Injectable()
export class FuzzyMatchScenario {
  readonly name = 'fuzzy-match';

  getQueries(): string[] {
    return [
      'Wireles Headphone',
      'Runing Shoes',
      'Coffe Maker',
      'Yooga Mat',
      'Laptp Stand',
    ];
  }
}
