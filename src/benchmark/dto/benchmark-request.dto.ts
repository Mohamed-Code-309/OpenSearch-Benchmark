import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BenchmarkType } from '../../common/enums/benchmark-type.enum';
import { SearchEngine } from '../../common/enums/search-engine.enum';

export class BenchmarkRequestDto {
  @IsArray()
  @IsEnum(SearchEngine, { each: true })
  engines: SearchEngine[];

  @IsArray()
  @IsEnum(BenchmarkType, { each: true })
  types: BenchmarkType[];

  @IsOptional()
  @IsInt()
  @Min(1)
  iterations?: number;

  @IsOptional()
  @IsString()
  query?: string;
}
