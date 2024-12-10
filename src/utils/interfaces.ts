export interface ISettings {
  globalMessage: string;
  organizerFee: number;
  tourCreationFee: number;
  // time is stored in milliseconds
  tourRecruitmentMaxTime: number;
  tourStartAwaitingTime: number;
  tourPlayingMaxTime: number;
  tourFreezeTime: number;
  organizerBanTime: number;
}

export interface IEntityWithImage {
  imgUrl?: string;
}