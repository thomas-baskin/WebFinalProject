import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat_room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatRoomId: number;

  @Column()
  userId: number;

  @Column()
  contents: string;

  @Column()
  userName: string;

  @Column()
  monsterName: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;
}
