export interface ISettings {
  payoutCommission: number;
  organizerFee: number;
  tourRecruitmentMaxTime: Date;
  tourStartAwaitingTime: Date;
  tourFreezeTime: Date;
  organizerBanTime: Date;
}

export interface IEntityWithImage {
  imgUrl?: string;
}