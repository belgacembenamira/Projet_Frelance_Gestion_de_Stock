import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from './devis.entity';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { ClientModule } from 'src/client/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Devis]),
    ClientModule, // Import the ClientModule
  ],
  providers: [DevisService],
  controllers: [DevisController],
})
export class DevisModule {}
