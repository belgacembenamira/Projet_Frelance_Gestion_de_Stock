import { Client } from 'src/client/client/client.entity';
import { ProductCommande } from 'src/commande/product-commande.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Devis {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number; // Total amount after discount

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid?: number; // Amount paid by the client

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountRemaining?: number; // Remaining balance to be paid

  @ManyToOne(() => Client, (client) => client.devis, { eager: true })
  client: Client; // The client associated with the Devis

  @OneToMany(() => ProductCommande, (productCommande) => productCommande.devis, {
    cascade: true,
    eager: true,
  })
  products: ProductCommande[]; // List of products in the Devis

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountAfterDiscount?: number; // Total amount after applying discounts

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Automatically updates the last modification timestamp
}
