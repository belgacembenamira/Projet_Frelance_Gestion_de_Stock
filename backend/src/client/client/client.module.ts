import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from 'src/Commande/commande.entity';
import { Product } from 'src/product/product.entity';
import { ProductCommande } from 'src/Commande/product-commande.entity';
import { Client } from './client.entity';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Devis } from 'src/Devis/Devis.entity'; // Import Devis entity

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commande,
      Product,
      ProductCommande,
      Client,
      Devis,
    ]), // Include Devis here
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [TypeOrmModule], // N'oubliez pas d'exporter TypeOrmModule
})
export class ClientModule {}
