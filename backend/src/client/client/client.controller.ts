// src/client/client.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { DeleteResult } from 'typeorm';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getAllClients(): Promise<Client[]> {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  getClientById(@Param('id') id: number): Promise<Client> {
    return this.clientService.getClientById(id);
  }

  @Post()
  createClient(@Body() clientData: Partial<Client>): Promise<Client> {
    return this.clientService.createClient(clientData);
  }

  @Patch(':id')
  updateClient(
    @Param('id') id: number,
    @Body() updateData: Partial<Client>,
  ): Promise<Client> {
    return this.clientService.updateClient(id, updateData);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204: No Content pour une suppression réussie
  async deleteClient(@Param('id') id: number): Promise<void> {
    await this.clientService.deleteClient(id);
  }

  // Suppression de tous les clients
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT) // 204: No Content pour la suppression
  async deleteAllClients(): Promise<void> {
    await this.clientService.deleteAllClients();
  }
  @Get('/search/phone')
  findByPhone(@Query('phone') phone: string): Promise<Client[]> {
    return this.clientService.findByPhone(phone);
  }

  @Get('/search/name')
  findClientsByName(@Query('name') name: string): Promise<Client[]> {
    return this.clientService.findClientsByName(name);
  }
}
