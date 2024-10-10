import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCommande } from './product-commande.entity';
import { Client } from 'src/client/client/client.entity';

@Entity()
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountRemaining: number;

  @ManyToOne(() => Client, (client) => client.Commandes, {
    onDelete: 'SET NULL', // Permet de ne pas supprimer le client en cascade
    nullable: true,
  })
  client: Client;

  @OneToMany(
    () => ProductCommande,
    (productCommande) => productCommande.commande,
    {
      cascade: true,
      eager: true,
      nullable: true,
    },
  )
  products: ProductCommande[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountAfterDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountBeforeDiscount: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
