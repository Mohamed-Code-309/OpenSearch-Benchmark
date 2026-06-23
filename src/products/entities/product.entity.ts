import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  name: string;

  @Column()
  description: string;

  @Column()
  @Index()
  category: string;

  @Column('simple-array', { default: '' })
  tags: string[];

  @Column('decimal')
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
