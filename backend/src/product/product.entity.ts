import { ProductCommande } from 'src/Commande/product-commande.entity';
import { Devis } from 'src/Devis/Devis.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  reference!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  quantity!: number;

  @Column({ type: 'decimal', nullable: true })
  price!: number;

  @Column({ type: 'decimal', nullable: true })
  supplierPrice!: number;

  @Column({ nullable: true })
  unite!: string;

  @OneToMany(
    () => ProductCommande,
    (productCommande) => productCommande.product,
  )
  productCommandes!: ProductCommande[];

  @ManyToOne(() => Devis, (devis) => devis.products, { nullable: true })
  devis?: Devis; // Make optional if it can be null
}
