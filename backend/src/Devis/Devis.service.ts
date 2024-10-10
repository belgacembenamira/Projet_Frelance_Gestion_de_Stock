import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devis } from './devis.entity';
import { ProductCommande } from '../commande/product-commande.entity';
import { Client } from 'src/client/client/client.entity';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createDevis(
    clientId: number,
    products: ProductCommande[],
    amountBeforeDiscount: number,
    amountAfterDiscount: number,
    amountPaid: number,
    amountRemaining: number,
  ): Promise<Devis> {
    // Vérification de l'existence du client
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    // Création du devis
    const devis = this.devisRepository.create({
      client,
      products,
      totalAmount: amountBeforeDiscount, // Montant avant remise
      amountAfterDiscount, // Montant après remise
      amountPaid, // Montant payé
      amountRemaining, // Montant restant
    });

    // Sauvegarde du devis dans la base de données
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

  async getDevisById(id: number): Promise<Devis> {
    const devis = await this.devisRepository.findOne({ where: { id } });
    if (!devis) {
      throw new NotFoundException('Devis non trouvé');
    }
    return devis;
  }
}
