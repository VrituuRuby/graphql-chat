import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;
}
