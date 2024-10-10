import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Create product
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { reference, price, quantity } = createProductDto;

    // Validate required fields
    if (!reference || price === undefined || quantity === undefined) {
      throw new BadRequestException(
        'Missing required fields: reference, price, and quantity',
      );
    }

    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Get all products with caching
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find({ cache: true });
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      cache: { id, milliseconds: 60000 },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Update product partially
  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  // Delete product by ID
  async deleteProduct(id: number): Promise<{ affected: number }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { affected: result.affected ?? 0 };
  }

  // Delete all products in stock
  async deleteAllProducts(): Promise<{ affected: number }> {
    const result = await this.productRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .execute();
    return { affected: result.affected ?? 0 };
  }

  // Find products by reference
  async findProductsByReference(reference: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { reference },
      cache: { id: `reference_${reference}`, milliseconds: 60000 },
    });
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    return product;
  }
}
