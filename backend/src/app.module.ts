import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as cors from 'cors';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandeModule } from './commande/commande.module';
import { DevisModule } from './devis/devis.module';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/supplier.entity'; // Entity import example
import { ClientModule } from './client/client/client.module';
import { CommandeFournisseurModule } from './CommandeFournisseur/CommandeFournisseur.module';
import { Devis } from './Devis/Devis.entity';
import { Product } from './product/product.entity';
import { ProductCommande } from './Commande/product-commande.entity';
import { Client } from './client/client/client.entity';
import { Commande } from './Commande/commande.entity';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true, // Makes configuration accessible across the entire app
    }),

    // TypeORM setup with dynamic configuration from environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'), // Ensure proper type conversion
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'), // Fixed to match env variable in .env
        entities: [
          Devis,
          join(__dirname, '**'),
          Devis,
          ProductCommande,
          Product,
          Client,
          Commande,
          Supplier,
          Devis,
        ], // Ensure entity paths are correctly resolved
        synchronize: true, // Should be disabled in production for safety
        logging: true,
        logger: 'advanced-console', // or 'simple-console' for simpler output
      }),
    }),

    // Application modules
    ClientModule,
    CommandeModule,
    DevisModule,
    ProductModule,
    CommandeFournisseurModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // Middleware to apply CORS globally
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*'); // Applying CORS to all routes
  }
}
