import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/room/model/room.model';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Room)
  room: Room;
}
