import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Post()
  create(@Body() supplier: Supplier): Promise<Supplier> {
    return this.supplierService.create(supplier);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() supplier: Supplier,
  ): Promise<Supplier> {
    return this.supplierService.update(id, supplier);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() partialSupplier: Partial<Supplier>,
  ): Promise<Supplier> {
    return this.supplierService.partialUpdate(id, partialSupplier);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplierService.remove(id);
  }
}
