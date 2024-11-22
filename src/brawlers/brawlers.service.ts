import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brawler } from '../database/entities/Brawler.entity';
import { Repository } from 'typeorm';
import { CreateBrawlerDto } from './dtos/CreateBrawler.dto';
import { UpdateBrawlerDto } from './dtos/UpdateBrawler.dto';
import { UserRole } from '../users/enums/role.enum';

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
      ...createBrawlerDto,
      names: JSON.stringify(createBrawlerDto.names)
    })
  }

  async updateBrawler(
    id: number,
    updateBrawlerDto: UpdateBrawlerDto
  ): Promise<any> {
    let payload: any = {
      id,
      ...updateBrawlerDto
    };
    if(updateBrawlerDto.names)
      payload.names = JSON.stringify(updateBrawlerDto.names);
    return this.brawlerRepository.save(payload);
  }

  async deleteBrawler(id: number): Promise<any> {
    const brawler = await this.brawlerRepository.findBy({ id });
    return this.brawlerRepository.remove(brawler);
  }
}
