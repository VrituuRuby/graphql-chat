import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [String], { nullable: true })
  permissions?: string[];

  @Field(() => [User], { nullable: true })
  friends?: User[];
}
