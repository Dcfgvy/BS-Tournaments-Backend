import { Test, TestingModule } from '@nestjs/testing';
import { BrawlStarsApiService } from './brawl-stars-api.processor';
import axios from 'axios';
import { Job } from 'bullmq';
import { HttpException, HttpStatus } from '@nestjs/common';
import { appConfig } from 'src/utils/appConfigs';

jest.mock('axios');

describe('BrawlStarsApiService', () => {
  let service: BrawlStarsApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrawlStarsApiService],
    }).compile();

    service = module.get<BrawlStarsApiService>(BrawlStarsApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('process', () => {
    it('should process get-name job and call getBSName', async () => {
      const job: Job = { name: 'get-name', data: { tag: '123ABC' } } as Job;
      jest.spyOn(service, 'getBSName').mockResolvedValue('PlayerName');

      const result = await service.process(job);

      expect(service.getBSName).toHaveBeenCalledWith('123ABC');
      expect(result).toBe('PlayerName');
    });

    it('should process confirm-account-by-tag job and call confirmAccountByTag', async () => {
      const job: Job = {
        name: 'confirm-account-by-tag',
        data: { tag: '#123ABC', trophyChange: 10 },
      } as Job;
      jest.spyOn(service, 'confirmAccountByTag').mockResolvedValue('PlayerName');

      const result = await service.process(job);

      expect(service.confirmAccountByTag).toHaveBeenCalledWith('#123ABC', 10);
      expect(result).toBe('PlayerName');
    });

    it('should process confirm-winners job and call confirmWinners', async () => {
      const job: Job = {
        name: 'confirm-winners',
        data: {
          organizerTag: '#456DEF',
          event: 'eventName',
          eventMap: 'eventMap',
          bannedBrawlers: ['Shelly'],
          winners: ['Player1', 'Player2'],
          teamSize: 2,
        },
      } as Job;
      jest.spyOn(service, 'confirmWinners').mockResolvedValue(true);

      const result = await service.process(job);

      expect(service.confirmWinners).toHaveBeenCalledWith(
        '#456DEF',
        'eventName',
        'eventMap',
        ['Shelly'],
        ['Player1', 'Player2'],
        2,
      );
      expect(result).toBe(true);
    });
  });

  describe('makeRequest', () => {
    it('should make a request to the Brawl Stars API and return data', async () => {
      const mockData = { name: 'PlayerName' };
      (axios as jest.Mocked<typeof axios>).get.mockResolvedValue({ data: mockData });

      const result = await service.makeRequest('#123ABC', false);

      expect(axios.get).toHaveBeenCalledWith(
        `https://api.brawlstars.com/v1/players/%23123ABC/`,
        {
          headers: {
            'Authorization': `Bearer ${appConfig.BRAWL_STARS_API_KEY}`
          }
        }
      );
      expect(result).toEqual(mockData);
    });

    it('should throw an HttpException on error', async () => {
      (axios as jest.Mocked<typeof axios>).get.mockRejectedValue(new Error('Request failed'));

      await expect(service.makeRequest('#123ABC', true)).rejects.toThrow(
        new HttpException('Intenal server error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('confirmAccountByTag', () => {
    it('should confirm account and return the player name', async () => {
      const mockBattlelog = {
        items: [
          {
            battle: {
              trophyChange: 10,
              players: [{ tag: '#123ABC', name: 'PlayerName' }],
            },
          },
        ],
      };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      const result = await service.confirmAccountByTag('#123ABC', 10);

      expect(result).toBe('PlayerName');
    });

    it('should return null if trophyChange does not match', async () => {
      const mockBattlelog = {
        items: [
          {
            battle: {
              trophyChange: 5,
              players: [{ tag: '#123ABC', name: 'PlayerName' }],
            },
          },
        ],
      };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      const result = await service.confirmAccountByTag('#123ABC', 10);

      expect(result).toBeNull();
    });

    it('should throw a NOT_FOUND exception if battlelog is empty', async () => {
      const mockBattlelog = { items: [] };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      await expect(service.confirmAccountByTag('#123ABC', 10)).rejects.toThrow(
        new HttpException('No battlelog found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getBSName', () => {
    it('should return the player name from the Brawl Stars API', async () => {
      const mockData = { name: 'PlayerName' };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockData);

      const result = await service.getBSName('#123ABC');

      expect(result).toBe('PlayerName');
    });

    it('should return "No name" if no name is present', async () => {
      const mockData = {};
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockData);

      const result = await service.getBSName('#123ABC');

      expect(result).toBe('No name');
    });
  });

  describe('confirmWinners', () => {
    it('should confirm winners for solo players and return true', async () => {
      const mockBattlelog = {
        items: [
          {
            event: { mode: 'eventName', map: 'eventMap' },
            battle: {
              players: [
                { tag: '#Player1', name: 'PlayerName1', brawler: { name: 'Shelly' } },
                { tag: '#Player2', name: 'PlayerName2', brawler: { name: 'Colt' } },
              ],
            },
          },
        ],
      };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      const result = await service.confirmWinners(
        '#456DEF',
        'eventName',
        'eventMap',
        [],
        ['#Player1', '#Player2'],
      );

      expect(result).toBe(true);
    });

    it('should return false if a banned brawler is found', async () => {
      const mockBattlelog = {
        items: [
          {
            event: { mode: 'eventName', map: 'eventMap' },
            battle: {
              players: [
                { tag: '#Player1', name: 'PlayerName1', brawler: { name: 'Shelly' } },
              ],
            },
          },
        ],
      };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      const result = await service.confirmWinners(
        '#456DEF',
        'eventName',
        'eventMap',
        ['Shelly'],
        ['#Player1'],
      );

      expect(result).toBe(false);
    });

    it('should throw an error if no valid battle data is found', async () => {
      const mockBattlelog = { items: [] };
      jest.spyOn(service, 'makeRequest').mockResolvedValue(mockBattlelog);

      await expect(
        service.confirmWinners(
          '#456DEF',
          'eventName',
          'eventMap',
          [],
          ['#Player1'],
        ),
      ).rejects.toThrow('No battlelog found');
    });
  });
});
