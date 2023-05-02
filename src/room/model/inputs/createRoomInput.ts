import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  name: string;

  @Field(() => [Int], { nullable: true })
  users_ids?: number[];
}
