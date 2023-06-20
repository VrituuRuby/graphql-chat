import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { Room } from './room.model';

@ObjectType()
export class UserPermissions {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  room_id: number;

  @Field(() => [String])
  permissions: string[];

  @Field(() => User)
  user: User;

  @Field(() => Room)
  room: Room;
}
