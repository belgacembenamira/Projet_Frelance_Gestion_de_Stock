import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommandeFournisseur } from './CommandeFournisseur.entity';
import { CommandeFournisseurService } from './CommandeFournisseur.service';
import { CreateCommandeFournisseurDto } from './dto/create-commande-fournisseur.dto';

@Controller('commande-fournisseur')
export class CommandeFournisseurController {
  constructor(
    private readonly commandeFournisseurService: CommandeFournisseurService,
  ) {}

  @Get()
  findAll(): Promise<CommandeFournisseur[]> {
    return this.commandeFournisseurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CommandeFournisseur> {
    return this.commandeFournisseurService.findOne(id);
  }

  @Post()
  async create(
    @Body() newCommande: CommandeFournisseur,
  ): Promise<CommandeFournisseur> {
    return await this.commandeFournisseurService.create(newCommande);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommandeDto: CommandeFournisseur,
  ): Promise<CommandeFournisseur> {
    return this.commandeFournisseurService.update(id, updateCommandeDto);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() partialCommande: Partial<CommandeFournisseur>,
  ): Promise<CommandeFournisseur> {
    return this.commandeFournisseurService.partialUpdate(id, partialCommande);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commandeFournisseurService.remove(id);
  }
}
