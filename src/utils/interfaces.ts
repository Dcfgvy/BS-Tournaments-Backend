export interface ISettings {
  payoutCommission: number;
  organizerFee: number;
  tourRecruitmentMaxTime: Date;
  tourStartAwaitingTime: Date;
  tourFreezeTime: Date;
  organizerBanTime: Date;
  telegramSupport: string;
}

export interface IEntityWithImage {
  imgUrl?: string;
}