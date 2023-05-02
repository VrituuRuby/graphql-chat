import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  room_id: number;

  @Field()
  text: string;
}
