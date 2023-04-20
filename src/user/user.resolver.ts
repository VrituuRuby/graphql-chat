import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserInput } from './models/inputs/createUserInput';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/model/message.model';
import { Room } from 'src/room/model/room.model';
import { RoomService } from 'src/room/room.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private roomService: RoomService,
  ) {}

  @Query((returns) => [User]!, { name: 'users' })
  async getAllUsers() {
    const users = await this.userService.findAll();
    console.log(users);
    return users;
  }

  @Query((returns) => User, { name: 'user' })
  async getOneUser(@Args('id', { type: () => Int }) id: number) {
    return await this.userService.findOneByID(id);
  }

  @Mutation((returns) => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return await this.userService.createUser({
      createdAt: new Date(),
      ...data,
    });
  }

  @ResolveField((returns) => [Room])
  async rooms(@Parent() user: User) {
    return await this.roomService.getAllRooms(user.id);
  }
}
