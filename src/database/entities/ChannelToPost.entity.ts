import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'channels_to_post' })
export class ChannelToPost extends BaseEntity {
  @PrimaryColumn()
  username: string;

  @Column()
  language: string;
}