import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetMessageInput {
  @Field()
  room_id: number;
}
