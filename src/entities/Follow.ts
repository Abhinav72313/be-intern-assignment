import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from './User';

@Entity('follows')
@Unique(['followerId', 'followingId'])
export class Follow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', name: 'follower_id' })
  followerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Column({ type: 'integer', name: 'following_id' })
  followingId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'following_id' })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
