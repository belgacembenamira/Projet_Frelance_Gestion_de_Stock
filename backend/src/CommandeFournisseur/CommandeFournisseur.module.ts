import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeFournisseurController } from './CommandeFournisseur.controller';
import { CommandeFournisseurService } from './CommandeFournisseur.service';
import { CommandeFournisseur } from './CommandeFournisseur.entity';
import { ProductCommande } from 'src/commande/product-commande.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommandeFournisseur, ProductCommande])],
  providers: [CommandeFournisseurService],
  controllers: [CommandeFournisseurController],
})
export class CommandeFournisseurModule {}
