// src/client/client.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { Client } from './client.entity';
import { Devis } from 'src/Devis/Devis.entity';
import { Commande } from 'src/Commande/commande.entity';
import { ProductCommande } from '../../Commande/product-commande.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Devis)
    private devisRepository: Repository<Devis>,
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,
    @InjectRepository(ProductCommande)
    private productCommandeRepository: Repository<ProductCommande>, // Injection du dépôt manquant
  ) {}

  // Récupérer tous les clients
  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  // Récupérer un client par ID
  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client non trouvé');
    return client;
  }

  // Créer un nouveau client
  async createClient(data: Partial<Client>): Promise<Client> {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  // Mettre à jour un client existant
  async updateClient(id: number, updateData: Partial<Client>): Promise<Client> {
    await this.clientRepository.update(id, updateData);
    return this.getClientById(id);
  }

  // Mettre à jour partiellement un client (PATCH)
  async patchClient(id: number, updateData: Partial<Client>): Promise<Client> {
    return this.updateClient(id, updateData);
  }

  async deleteClient(id: number): Promise<void> {
    // Assurez-vous que la relation est correctement incluse lors de la suppression
    const client = await this.getClientById(id);
    await this.clientRepository.remove(client);
  }
  // Nouvelle méthode pour supprimer tous les clients
  async deleteAllClients(): Promise<void> {
    const clients = await this.clientRepository.find();
    for (const client of clients) {
      await this.deleteClient(client.id);
    }
  }

  // Recherche par numéro de téléphone
  async findByPhone(phone: string): Promise<Client[]> {
    return this.clientRepository.find({ where: { phone: Like(`%${phone}%`) } });
  }

  // Recherche par nom
  async findClientsByName(name: string): Promise<Client[]> {
    return this.clientRepository.find({ where: { name: Like(`%${name}%`) } });
  }
}
