import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brawler } from '../../typeorm/entities/Brawler.entity';
import { Repository } from 'typeorm';
import { CreateBrawlerDto } from './dtos/CreateBrawler.dto';
import { UpdateBrawlerDto } from './dtos/UpdateBrawler.dto';
import { UserRole } from '../../users/enums/role.enum';

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

  async fetchBrawlerById(id: number, userRoles: UserRole[]): Promise<Brawler> {
    const brawler = await this.brawlerRepository.findOneBy({
      id: id
    });
    if(brawler?.isDisabled && !userRoles.includes(UserRole.ADMIN)) return null;
    return brawler;
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
    return this.brawlerRepository.save({
      id,
      ...updateBrawlerDto
    });
  }

  async deleteBrawler(id: number): Promise<any> {
    const brawler = await this.brawlerRepository.findBy({ id });
    return this.brawlerRepository.remove(brawler);
  }
}
