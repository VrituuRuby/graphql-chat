import { Field, InputType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  name: string;

  @Field(() => [Number])
  users_ids?: number[];
}
