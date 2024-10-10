import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCommande } from 'src/Commande/product-commande.entity';
import { CommandeFournisseur } from './CommandeFournisseur.entity';

@Injectable()
export class CommandeFournisseurService {
  constructor(
    @InjectRepository(CommandeFournisseur)
    private readonly commandeFournisseurRepository: Repository<CommandeFournisseur>,

    @InjectRepository(ProductCommande)
    private readonly productCommandeRepository: Repository<ProductCommande>,
  ) {}

  findAll(): Promise<CommandeFournisseur[]> {
    return this.commandeFournisseurRepository.find({
      relations: ['supplier', 'productCommande'],
    });
  }

  findOne(id: string): Promise<CommandeFournisseur> {
    return this.commandeFournisseurRepository.findOne({
      where: { id: +id },
      relations: ['supplier', 'productCommande'],
    });
  }

  async create(newCommande: CommandeFournisseur): Promise<CommandeFournisseur> {
    const commandeFournisseur =
      this.commandeFournisseurRepository.create(newCommande);

    // Here, you might want to ensure that each product has the correct associations
    if (commandeFournisseur.products) {
      commandeFournisseur.products.forEach((productCommande) => {
        productCommande.productId = productCommande.product.id; // Set productId from product instance
      });
    }

    return await this.commandeFournisseurRepository.save(commandeFournisseur);
  }
  async update(
    id: string,
    commande: CommandeFournisseur,
  ): Promise<CommandeFournisseur> {
    if (!commande || Object.keys(commande).length === 0) {
      throw new Error('No update values provided.');
    }

    await this.commandeFournisseurRepository.update(id, commande);
    return this.findOne(id);
  }

  async partialUpdate(
    id: string,
    partialCommande: Partial<CommandeFournisseur>,
  ): Promise<CommandeFournisseur> {
    if (!partialCommande || Object.keys(partialCommande).length === 0) {
      throw new Error('No update values provided.');
    }

    await this.commandeFournisseurRepository.update(id, partialCommande);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.commandeFournisseurRepository.delete(id);
  }
}
