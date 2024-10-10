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
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountRemaining?: number;

  @ManyToOne(() => Client, (client) => client.devis)
  client: Client;

  @OneToMany(
    () => ProductCommande,
    (productCommande) => productCommande.devis,
    {
      cascade: true,
      eager: true,
    },
  )
  products: ProductCommande[];

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountAfterDiscount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountBeforeDiscount?: number;
}
