import { Field, InputType } from '@nestjs/graphql';
import { RoomPermissions } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

@InputType()
export class UpdateUserPermissionsInput {
  @Field()
  @IsInt()
  room_id: number;

  @Field()
  @IsInt()
  user_id: number;

  @Field(() => [String])
  @IsEnum(RoomPermissions)
  permissions: RoomPermissions[];
}
