import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { defaultValue: true })
  isPrivate: boolean;
}
