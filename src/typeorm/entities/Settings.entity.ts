import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'settings' })
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  value: string;
}