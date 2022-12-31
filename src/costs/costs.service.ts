/* eslint-disable prettier/prettier */
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cost, CostsDocument } from '../schemas/costs.schema';
import { CreateCostDto } from './dto/create-costs.dto';
import { UpdateCostDto } from './dto/update-costs.dto';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(Cost.name) private costsModel: Model<CostsDocument>,
  ) {}

  async findAll(): Promise<Cost[]> {
    return this.costsModel.find();
  }

  async findOne(id: string): Promise<Cost> {
    return this.costsModel.findOne({ _id: id });
  }

  async create(createCostsDto: CreateCostDto): Promise<Cost> {
    const cteateCosts = new this.costsModel(createCostsDto)
    return cteateCosts.save()
  }

  async update(updateCostsDto: UpdateCostDto, id: string): Promise<Cost> {
    await this.costsModel.updateOne(
        { _id: id },
        {
            $set: {
                ...updateCostsDto,
            },
        },
    );

    return this.findOne(id);

  }

  async delete(id: string): Promise<void> {
    await this.costsModel.deleteOne({ _id: id });
  }
}
