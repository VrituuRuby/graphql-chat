import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/room/model/room.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => Date)
  createdAt: Date;
}
