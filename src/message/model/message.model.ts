import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  room_id: number;
}
