import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOneBy({ id: +id });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async create(supplier: Supplier): Promise<Supplier> {
    try {
      return await this.supplierRepository.save(supplier);
    } catch (error) {
      throw new ConflictException(`Failed to create supplier: ${error.message}`);
    }
  }

  async update(id: string, supplier: Supplier): Promise<Supplier> {
    const existingSupplier = await this.findOne(id);
    if (!existingSupplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    await this.supplierRepository.update(id, supplier);
    return this.findOne(id);
  }

  async partialUpdate(id: string, partialSupplier: Partial<Supplier>): Promise<Supplier> {
    await this.supplierRepository.update(id, partialSupplier);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    await this.supplierRepository.delete(id);
  }
}
