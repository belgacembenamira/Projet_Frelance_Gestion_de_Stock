import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { Devis } from './devis.entity';
import { ProductCommande } from '../commande/product-commande.entity';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  async createDevis(
    @Body('clientId') clientId: number,
    @Body('products') products: ProductCommande[],
    @Body('amountBeforeDiscount') amountBeforeDiscount: number,
    @Body('amountAfterDiscount') amountAfterDiscount: number,
    @Body('amountPaid') amountPaid: number,
    @Body('amountRemaining') amountRemaining: number,
  ): Promise<Devis> {
    try {
      // Appel du service pour créer un devis
      return await this.devisService.createDevis(
        clientId,
        products,
        amountBeforeDiscount,
        amountAfterDiscount,
        amountPaid,
        amountRemaining,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          'Erreur lors de la création du devis : ' + error.message,
        );
      }
      throw error;
    }
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
