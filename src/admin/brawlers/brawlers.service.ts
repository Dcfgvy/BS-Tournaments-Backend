import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brawler } from '../../typeorm/entities/Brawler.entity';
import { Repository } from 'typeorm';
import { CreateBrawlerDto } from './dtos/CreateBrawler.dto';
import { UpdateBrawlerDto } from './dtos/UpdateBrawler.dto';

@Injectable()
export class BrawlersService {
  constructor(
    @InjectRepository(Brawler) private brawlerRepository: Repository<Brawler>
  ) {}

  fetchAllBrawlers(): Promise<Brawler[]> {
    return this.brawlerRepository.find();
  }

  fetchActiveBrawlers(): Promise<Brawler[]> {
    return this.brawlerRepository.find({
      where: {
        isDisabled: false
      }
    });
  }
  createBrawler(
    createBrawlerDto: CreateBrawlerDto
  ): Promise<any> {
    return this.brawlerRepository.save({
      ...createBrawlerDto
    })
  }

  async updateBrawler(
    id: number,
    updateBrawlerDto: UpdateBrawlerDto
  ): Promise<any> {
    await this.brawlerRepository.save({
      id,
      ...updateBrawlerDto
    });
    return this.brawlerRepository.findOneBy({ id });
  }

  deleteBrawler(id: number): Promise<any> {
    return this.brawlerRepository.delete({ id });
  }
}
