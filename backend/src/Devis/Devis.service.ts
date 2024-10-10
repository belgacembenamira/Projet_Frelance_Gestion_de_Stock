import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devis } from './devis.entity';
import { Client } from 'src/client/client/client.entity';
import { ProductCommande } from 'src/commande/product-commande.entity';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async getAllDevis(): Promise<Devis[]> {
    return await this.devisRepository.find({
      relations: ['client', 'products', 'products.product'],
    });
  }

  async getDevisById(id: number): Promise<Devis> {
    const devis = await this.devisRepository.findOne({
      where: { id },
      relations: ['client', 'products', 'products.product'],
    });
    if (!devis) {
      throw new NotFoundException('Devis non trouvé');
    }
    return devis;
  }

  async createDevis(
    clientId: number,
    products: ProductCommande[],
    amountBeforeDiscount: number,
    amountAfterDiscount: number,
    amountPaid: number,
    amountRemaining: number,
  ): Promise<Devis> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    const devis = this.devisRepository.create({
      client,
      products,
      amountBeforeDiscount,
      amountAfterDiscount,
      amountPaid,
      amountRemaining,
    });

    return await this.devisRepository.save(devis);
  }

  async updateDevis(id: number, updateData: Partial<Devis>): Promise<Devis> {
    await this.getDevisById(id);
    await this.devisRepository.update(id, updateData);
    return this.getDevisById(id);
  }

  async deleteDevis(id: number): Promise<void> {
    const devis = await this.getDevisById(id);
    await this.devisRepository.remove(devis);
  }
}
