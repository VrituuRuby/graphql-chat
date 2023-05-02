import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddUsersToRoomInput {
  @Field(() => Int)
  room_id: number;

  @Field(() => [Int])
  users_ids: number[];
}
