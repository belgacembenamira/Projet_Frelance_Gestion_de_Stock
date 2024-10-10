import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './create-commande.dto';
import { UpdateCommandeDto } from './update-commande.dto';
import { stringify } from 'flatted';
import { UpdateProductDto } from 'src/product/dto/product.dto';

@Controller('commandes') // Changement pour le pluriel
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post() // Add this decorator
  async create(@Body() createCommandeDto: CreateCommandeDto) {
    const commande =
      await this.commandeService.createCommande(createCommandeDto);
    const response = stringify(commande);
    return response; // Return the serialized response
  }
  @Get('get')
  findAll() {
    return this.commandeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandeDto: UpdateCommandeDto,
  ) {
    return this.commandeService.updateCommande(+id, updateCommandeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Indique que la ressource a été supprimée
  remove(@Param('id') id: string) {
    return this.commandeService.deleteCommande(+id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // Indique que toutes les ressources ont été supprimées
  removeAll() {
    return this.commandeService.deleteAllCommandes();
  }

  // Supprimer une commande et le client associé
  @Delete(':id/with-client')
  @HttpCode(HttpStatus.NO_CONTENT) // Indique que la ressource a été supprimée
  removeCommandeWithClient(@Param('id') id: string) {
    return this.commandeService.deleteCommandeWithClient(+id);
  }
  @Post(':id/products')
  async addProduct(
    @Param('id') id: string,
    @Body() productData: { id: number; quantity: number; discount?: number },
  ) {
    return this.commandeService.addProduct(+id, productData);
  }

  @Patch(':commandeId/products/:productId')
  async updateProduct(
    @Param('commandeId') commandeId: string,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.commandeService.updateProduct(
      +commandeId,
      +productId,
      updateProductDto,
    );
  }

  @Delete(':commandeId/products/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeProduct(
    @Param('commandeId') commandeId: string,
    @Param('productId') productId: string,
  ) {
    return this.commandeService.removeProduct(+commandeId, +productId);
  }
}
