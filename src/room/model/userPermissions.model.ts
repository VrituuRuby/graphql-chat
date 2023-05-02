import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class UserPermissions {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  room_id: number;

  @Field(() => [String])
  permissions: string[];

  @Field()
  user: User;
}
