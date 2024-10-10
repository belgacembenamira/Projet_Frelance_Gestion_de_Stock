import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './commande.entity';
import { Product } from '../product/product.entity';
import { ProductCommande } from './product-commande.entity';
import { CommandeService } from './commande.service';
import { CommandeController } from './commande.controller';
import { ClientModule } from 'src/client/client/client.module';
import { Client } from 'src/client/client/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commande, Product, ProductCommande, Client]),
  ],
  providers: [CommandeService],
  controllers: [CommandeController],
  exports: [CommandeService],
})
export class CommandeModule {}
