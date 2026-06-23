import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return null as unknown as Product;
  }

  async findAll(): Promise<Product[]> {
    return [];
  }

  async findOne(id: string): Promise<Product> {
    return null as unknown as Product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    return null as unknown as Product;
  }

  async remove(id: string): Promise<void> {}
}
