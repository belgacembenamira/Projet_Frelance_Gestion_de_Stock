import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'express';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Res() res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      return res.status(HttpStatus.OK).json(products);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.productService.getProductById(+id);
      return product
        ? res.status(HttpStatus.OK).json(product)
        : res
            .status(HttpStatus.NOT_FOUND)
            .json({ error: 'Product not found.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Get('reference/:reference')
  async getProductsByReference(
    @Param('reference') reference: string,
    @Res() res: Response,
  ) {
    try {
      const products =
        await this.productService.findProductsByReference(reference);
      return res.status(HttpStatus.OK).json(products);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productService.createProduct(createProductDto);
      return res.status(HttpStatus.CREATED).json(product);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Patch(':id')
  async patchProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const updatedProduct = await this.productService.updateProduct(
        +id,
        updateProductDto,
      );
      return updatedProduct
        ? res.status(HttpStatus.OK).json(updatedProduct)
        : res
            .status(HttpStatus.NOT_FOUND)
            .json({ error: 'Product not found.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.productService.deleteProduct(+id);
      return result.affected === 1
        ? res.status(HttpStatus.NO_CONTENT).send()
        : res
            .status(HttpStatus.NOT_FOUND)
            .json({ error: 'Product not found.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @Delete('/stock/clear')
  async deleteAllProducts(@Res() res: Response) {
    try {
      const result = await this.productService.deleteAllProducts();
      return res
        .status(HttpStatus.OK)
        .json({ message: 'All products deleted', affected: result.affected });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
