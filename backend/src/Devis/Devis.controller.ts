import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto, UpdateDevisDto } from './dto/devis.dto';

@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  async create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.createDevis(createDevisDto);
  }

  @Get()
  async findAll() {
    return this.devisService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.devisService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDevisDto: UpdateDevisDto,
  ) {
    return this.devisService.updateDevis(+id, updateDevisDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.devisService.deleteDevis(+id);
  }
}
