import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchEngine } from '../../common/enums/search-engine.enum';

export class SearchQueryDto {
  @IsString()
  query: string;

  @IsEnum(SearchEngine)
  engine: SearchEngine;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
