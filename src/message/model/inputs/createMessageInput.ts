import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  user_id: number;

  @Field()
  room_id: number;

  @Field()
  text: string;
}
