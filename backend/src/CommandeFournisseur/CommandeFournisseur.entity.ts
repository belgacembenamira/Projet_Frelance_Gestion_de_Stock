import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCommande } from '../Commande/product-commande.entity';
import { Supplier } from 'src/Supplier/Supplier.entity';

@Entity('CommandeFournisseur')
export class CommandeFournisseur {
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

  @ManyToOne(() => Supplier, (supplier) => supplier.commandeFournisseur, {
    onDelete: 'SET NULL', // Keeps the supplier if deleted
    nullable: true,
  })
  supplier: Supplier;

  @OneToMany(
    () => ProductCommande,
    (productCommande) => productCommande.commandeFournisseur,
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
