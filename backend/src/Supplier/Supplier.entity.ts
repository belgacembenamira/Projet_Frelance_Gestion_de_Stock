import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { ProductCommande } from 'src/Commande/product-commande.entity';
import { CommandeFournisseur } from 'src/CommandeFournisseur/CommandeFournisseur.entity';

@Entity('Supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  matriculeFiscal?: string;

  @Column({ nullable: true })
  codeTVA?: string;

  @Column({ nullable: true })
  codeCategorie?: string;

  @Column({ nullable: true })
  nEtabSecondaire?: string;

  @Column({ nullable: true })
  rue?: string;

  @Column({ nullable: true })
  email: string;
  @ManyToOne(() => Supplier, (supplier) => supplier.productCommandes)
  supplier: Supplier;
  productCommandes!: Promise<ProductCommande[]>;

  @OneToMany(
    () => CommandeFournisseur,
    (commandeFournisseur) => commandeFournisseur.supplier,
  )
  commandeFournisseur!: CommandeFournisseur[];
}
