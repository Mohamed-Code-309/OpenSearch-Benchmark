import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto implements Partial<CreateProductDto> {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  brand?: string;
}
