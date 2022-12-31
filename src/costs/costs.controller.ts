import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Delete, Param, Patch } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';

import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guard/jwt.guards';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-costs.dto';
import { UpdateCostDto } from './dto/update-costs.dto';

@Controller('costs')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCosts(@Req() req, @Res() res) {
    const token = req.token;

    const user = await this.authService.getUserByTokenData(token);
    const costs = await this.costsService.findAll();
    const filteredCosts = costs.filter(
      (cost) => cost.userId === user._id.toString(),
    );

    console.log(filteredCosts, 'filteredCosts');

    return res.send(filteredCosts);
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCosts(@Body() createCostsDto: CreateCostDto, @Req() req) {
    const user = await this.authService.getUserByTokenData(req.token);

    return await this.costsService.create({
      ...createCostsDto,
      userId: user._id as string,
    });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCosts(
    @Body() updateCostsDto: UpdateCostDto,
    @Param('id') id: string,
  ) {
    return this.costsService.update(updateCostsDto, id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCosts(@Param('id') id: string) {
    return await this.costsService.delete(id);
  }
}
