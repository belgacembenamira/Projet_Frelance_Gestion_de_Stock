import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Commande } from './commande.entity';
import { CreateCommandeDto } from './create-commande.dto';

import { Product } from '../product/product.entity';
import { ProductCommande } from './product-commande.entity';
import { Client } from 'src/client/client/client.entity';
import { UpdateCommandeDto } from './update-commande.dto';
import { UpdateProductDto } from 'src/product/dto/product.dto';

@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCommande)
    private productCommandeRepository: Repository<ProductCommande>,
  ) {}

  // Créer une commande
  async createCommande(
    createCommandeDto: CreateCommandeDto,
  ): Promise<Commande> {
    const {
      clientId,
      date,
      products,
      amountBeforeDiscount,
      amountAfterDiscount,
      amountPaid,
      amountRemaining,
    } = createCommandeDto;

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException('Client non trouvé');

    const commande = new Commande();
    commande.client = client;
    commande.date = new Date(date);
    commande.amountBeforeDiscount = amountBeforeDiscount;
    commande.amountAfterDiscount = amountAfterDiscount;
    commande.amountPaid = amountPaid;
    commande.amountRemaining = amountRemaining;

    // Créer les relations avec les produits
    commande.products = await Promise.all(
      products.map(async (productData) => {
        const product = await this.productRepository.findOne({
          where: { id: productData.id },
        });
        if (!product)
          throw new NotFoundException(
            `Produit avec l'ID ${productData.id} non trouvé`,
          );

        const productCommande = new ProductCommande();
        productCommande.product = product;
        productCommande.quantity = productData.quantity;
        productCommande.discount = productData.discount || 0;
        productCommande.commande = commande;

        return productCommande;
      }),
    );

    return this.commandeRepository.save(commande);
  }

  // Récupérer toutes les commandes
  async findAll(): Promise<Commande[]> {
    return this.commandeRepository.find({
      relations: ['client', 'products', 'products.product'],
    });
  }

  // Récupérer une commande par ID
  async findOne(id: number): Promise<Commande> {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: ['client', 'products', 'products.product'],
    });
    if (!commande) throw new NotFoundException('Commande non trouvée');
    return commande;
  }

  // Mettre à jour une commande
  async updateCommande(
    id: number,
    updateCommandeDto: UpdateCommandeDto,
  ): Promise<Commande> {
    const commande = await this.findOne(id);
    Object.assign(commande, updateCommandeDto);
    return this.commandeRepository.save(commande);
  } // Récupérer une commande par ID
  async findWhere(id: number): Promise<Commande> {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: ['client', 'products', 'products.product'],
    });

    if (!commande) throw new NotFoundException('Commande non trouvée');

    return commande;
  }

  // Supprimer une commande
  async deleteCommande(id: number): Promise<void> {
    // Utilisation de findWhere pour trouver la commande par ID
    const commande = await this.findWhere(id); // Correction ici

    // Supprimer les relations dans product_commande
    await this.productCommandeRepository.delete({ commande });

    // Supprimer la commande
    await this.commandeRepository.delete(id);
  }

  async deleteAllCommandes(): Promise<void> {
    await this.commandeRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Supprimer les enregistrements dans product_commande
        await entityManager.getRepository(ProductCommande).delete({}); // Utilisation de delete

        // Supprimer les commandes
        await entityManager.getRepository(Commande).delete({}); // Utilisation de delete
      },
    );
  }
  async deleteCommandeWithClient(id: number): Promise<void> {
    // Utilisation de findWhere pour trouver la commande par ID
    const commande = await this.findWhere(id); // Correction ici

    // Supprimer les relations dans product_commande
    await this.productCommandeRepository.delete({ commande });

    // Supprimer le client associé à la commande
    await this.clientRepository.delete(commande.client.id);

    // Supprimer la commande
    await this.commandeRepository.delete(id);
  } // Modifier un produit spécifique dans une commande
  async updateProduct(
    commandeId: number,
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductCommande> {
    const commande = await this.findOne(commandeId);
    const productCommande = commande.products.find(
      (pc) => pc.product.id === productId,
    );

    if (!productCommande) {
      throw new NotFoundException(
        `Produit avec l'ID ${productId} non trouvé dans la commande`,
      );
    }

    // Mettre à jour les détails du produit
    Object.assign(productCommande, updateProductDto);

    await this.productCommandeRepository.save(productCommande);
    return productCommande;
  }

  // Ajouter un produit à une commande
  async addProduct(
    commandeId: number,
    productData: { id: number; quantity: number; discount?: number },
  ): Promise<ProductCommande> {
    const commande = await this.findOne(commandeId);
    const product = await this.productRepository.findOne({
      where: { id: productData.id },
    });

    if (!product)
      throw new NotFoundException(
        `Produit avec l'ID ${productData.id} non trouvé`,
      );

    const productCommande = new ProductCommande();
    productCommande.product = product;
    productCommande.quantity = productData.quantity;
    productCommande.discount = productData.discount || 0;
    productCommande.commande = commande;

    commande.products.push(productCommande); // Ajoutez le produit à la commande

    await this.commandeRepository.save(commande); // Enregistrez la commande mise à jour

    return productCommande;
  }

  // Supprimer un produit spécifique d'une commande
  async removeProduct(commandeId: number, productId: number): Promise<void> {
    const commande = await this.findOne(commandeId);
    const productCommandeIndex = commande.products.findIndex(
      (pc) => pc.product.id === productId,
    );

    if (productCommandeIndex === -1) {
      throw new NotFoundException(
        `Produit avec l'ID ${productId} non trouvé dans la commande`,
      );
    }

    commande.products.splice(productCommandeIndex, 1); // Supprimez le produit de la liste
    await this.commandeRepository.save(commande); // Enregistrez la commande mise à jour
  }
}
