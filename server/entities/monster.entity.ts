import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Monster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxhunger: number;

  @Column()
  monsterId: string; // which sprite to use
}
