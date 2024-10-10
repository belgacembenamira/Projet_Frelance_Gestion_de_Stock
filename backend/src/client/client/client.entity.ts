import { Commande } from 'src/Commande/commande.entity';
import { Devis } from 'src/Devis/Devis.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('Client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  totalAmountToPay?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  amountPaid?: number; // Ajouté pour stocker le montant déjà payé

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  amountRemaining?: number;

  @OneToMany(() => Commande, (commande) => commande.client)
  Commandes: Commande[];

  @OneToMany(() => Devis, (devis) => devis.client)
  devis: Devis[];
}
