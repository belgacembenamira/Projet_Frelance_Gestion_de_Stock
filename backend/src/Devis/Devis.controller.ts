import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { Devis } from './devis.entity';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Get()
  async getAllDevis(): Promise<Devis[]> {
    return this.devisService.getAllDevis();
  }

  @Get(':id')
  async getDevisById(@Param('id') id: number): Promise<Devis> {
    return this.devisService.getDevisById(id);
  }

  @Post()
  async createDevis(
    @Body()
    createDevisDto: {
      clientId: number;
      products: any[];
      amountBeforeDiscount: number;
      amountAfterDiscount: number;
      amountPaid: number;
      amountRemaining: number;
    },
  ): Promise<Devis> {
    const {
      clientId,
      products,
      amountBeforeDiscount,
      amountAfterDiscount,
      amountPaid,
      amountRemaining,
    } = createDevisDto;
    return this.devisService.createDevis(
      clientId,
      products,
      amountBeforeDiscount,
      amountAfterDiscount,
      amountPaid,
      amountRemaining,
    );
  }

  @Patch(':id')
  async updateDevis(
    @Param('id') id: number,
    @Body() updateDevisDto: Partial<Devis>,
  ): Promise<Devis> {
    return this.devisService.updateDevis(id, updateDevisDto);
  }

  @Delete(':id')
  async deleteDevis(@Param('id') id: number): Promise<void> {
    return this.devisService.deleteDevis(id);
  }
}
