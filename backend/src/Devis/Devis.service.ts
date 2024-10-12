import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Devis } from './Devis.entity';
import { Product } from 'src/product/product.entity';
import { ProductCommande } from 'src/commande/product-commande.entity';
import { CreateDevisDto, UpdateDevisDto } from './dto/devis.dto';
import { Client } from 'src/client/client/client.entity';
import { UpdateProductDto } from 'src/product/dto/product.dto';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private DevisRepository: Repository<Devis>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCommande)
    private ProductCommandeRepository: Repository<ProductCommande>,
  ) {}

  async createDevis(createDevisDto: CreateDevisDto): Promise<Devis> {
    const {
      clientId,
      date,
      products,
      amountAfterDiscount, // Use only amountAfterDiscount
      amountPaid,
      amountRemaining,
    } = createDevisDto;

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException('Client non trouvé');

    const newDevis = new Devis();
    newDevis.client = client;
    newDevis.date = new Date(date);
    newDevis.amountAfterDiscount = amountAfterDiscount;
    newDevis.amountPaid = amountPaid;
    newDevis.amountRemaining = amountRemaining;

    const productCommandes = await Promise.all(
      products.map(
        async (productData: {
          id: number;
          quantity: number;
          discount?: number;
        }) => {
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
          productCommande.devis = newDevis;

          return productCommande;
        },
      ),
    );

    newDevis.products = productCommandes;

    return this.DevisRepository.save(newDevis);
  }
  // Récupérer toutes les Deviss
  async findAll(): Promise<Devis[]> {
    return this.DevisRepository.find({
      relations: ['client', 'products', 'products.product'],
    });
  }

  // Récupérer une Devis par ID
  async findOne(id: number): Promise<Devis> {
    const Devis = await this.DevisRepository.findOne({
      where: { id },
      relations: ['client', 'products', 'products.product'],
    });
    if (!Devis) throw new NotFoundException('Devis non trouvée');
    return Devis;
  }

  // Mettre à jour une Devis
  async updateDevis(
    id: number,
    updateDevisDto: UpdateDevisDto,
  ): Promise<Devis> {
    const Devis = await this.findOne(id);
    Object.assign(Devis, updateDevisDto);
    return this.DevisRepository.save(Devis);
  } // Récupérer une Devis par ID
  async findWhere(id: number): Promise<Devis> {
    const Devis = await this.DevisRepository.findOne({
      where: { id },
      relations: ['client', 'products', 'products.product'],
    });

    if (!Devis) throw new NotFoundException('Devis non trouvée');

    return Devis;
  }

  // Supprimer une Devis
  async deleteDevis(id: number): Promise<void> {
    // Utilisation de findWhere pour trouver la Devis par ID
    const Devis = await this.findWhere(id); // Correction ici

    // Supprimer les relations dans product_Devis
    await this.ProductCommandeRepository.delete({ devis: Devis });

    // Supprimer la Devis
    await this.DevisRepository.delete(id);
  }

  async deleteAllDeviss(): Promise<void> {
    await this.DevisRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Supprimer les enregistrements dans product_Devis
        await entityManager.getRepository(ProductCommande).delete({}); // Utilisation de delete

        // Supprimer les Deviss
        await entityManager.getRepository(Devis).delete({}); // Utilisation de delete
      },
    );
  }
  async deleteDevisWithClient(id: number): Promise<void> {
    // Utilisation de findWhere pour trouver la Devis par ID
    const Devis = await this.findWhere(id); // Correction ici

    // Supprimer les relations dans product_Devis
    await this.ProductCommandeRepository.delete({ devis: Devis });

    // Supprimer le client associé à la Devis
    await this.clientRepository.delete(Devis.client.id);

    // Supprimer la Devis
    await this.DevisRepository.delete(id);
  } // Modifier un produit spécifique dans une Devis
  async updateProduct(
    DevisId: number,
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductCommande> {
    const Devis = await this.findOne(DevisId);
    const ProductCommande = Devis.products.find(
      (pc) => pc.product.id === productId,
    );

    if (!ProductCommande) {
      throw new NotFoundException(
        `Produit avec l'ID ${productId} non trouvé dans la Devis`,
      );
    }

    // Mettre à jour les détails du produit
    Object.assign(ProductCommande, updateProductDto);

    await this.ProductCommandeRepository.save(ProductCommande);
    return ProductCommande;
  }

  // Ajouter un produit à une Devis
  async addProduct(
    DevisId: number,
    productData: { id: number; quantity: number; discount?: number },
  ): Promise<ProductCommande> {
    const Devis = await this.findOne(DevisId);
    const product = await this.productRepository.findOne({
      where: { id: productData.id },
    });

    if (!product)
      throw new NotFoundException(
        `Produit avec l'ID ${productData.id} non trouvé`,
      );

    const newProductCommande = new ProductCommande();
    newProductCommande.product = product;
    newProductCommande.quantity = productData.quantity;
    newProductCommande.discount = productData.discount || 0;
    newProductCommande.devis = Devis;

    Devis.products.push(newProductCommande); // Ajoutez le produit à la Devis

    await this.DevisRepository.save(Devis); // Enregistrez la Devis mise à jour

    return newProductCommande;
  }

  // Supprimer un produit spécifique d'une Devis
  async removeProduct(DevisId: number, productId: number): Promise<void> {
    const Devis = await this.findOne(DevisId);
    const ProductCommandeIndex = Devis.products.findIndex(
      (pc) => pc.product.id === productId,
    );

    if (ProductCommandeIndex === -1) {
      throw new NotFoundException(
        `Produit avec l'ID ${productId} non trouvé dans la Devis`,
      );
    }

    Devis.products.splice(ProductCommandeIndex, 1); // Supprimez le produit de la liste
    await this.DevisRepository.save(Devis); // Enregistrez la Devis mise à jour
  }
}
