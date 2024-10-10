import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from '../product/product.entity';
import { Commande } from './commande.entity'; // Importing Commande entity for relationship
import { CommandeFournisseur } from 'src/CommandeFournisseur/CommandeFournisseur.entity'; // Importing CommandeFournisseur entity
import { Devis } from 'src/Devis/Devis.entity'; // Importing Devis entity for relationship

@Entity('ProductCommande')
export class ProductCommande {
  @PrimaryGeneratedColumn()
  id!: number; // Unique identifier for each ProductCommande

  // Many-to-one relationship with the Product entity
  @ManyToOne(() => Product, (product) => product.productCommandes, {
    onDelete: 'CASCADE', // Delete ProductCommandes if the Product is deleted
  })
  product!: Product;

  @Column({ type: 'int', nullable: false }) // Quantity of the product
  quantity!: number;

  // Foreign key referencing Product
  @Column({ type: 'int', nullable: false })
  productId!: number; // To store the ID of the associated Product

  // Optional relationship with Devis
  @ManyToOne(() => Devis, (devis) => devis.products, {
    nullable: true,
  })
  devis?: Devis; // Can be null if no associated Devis

  // Optional relationship with CommandeFournisseur
  @ManyToOne(
    () => CommandeFournisseur,
    (commandeFournisseur) => commandeFournisseur.products,
    {
      nullable: true,
    },
  )
  commandeFournisseur?: CommandeFournisseur; // Can be null if no associated CommandeFournisseur

  // Optional relationship with Commande
  @ManyToOne(() => Commande, (commande) => commande.products, {
    nullable: true,
  })
  commande?: Commande; // Can be null if no associated Commande

  // Optional field for discount on the product
  @Column({ type: 'float', nullable: true })
  discount?: number; // Can be null if no discount is applied
}
