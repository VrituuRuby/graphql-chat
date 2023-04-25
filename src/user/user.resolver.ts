import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserInput } from './models/inputs/createUserInput';
import { MessageService } from 'src/message/message.service';
import { Room } from 'src/room/model/room.model';
import { RoomService } from 'src/room/room.service';
import { PubSub } from 'graphql-subscriptions';
import { Message } from 'src/message/model/message.model';

const pubSub = new PubSub();

@Resolver((of) => User)
export class UsersResolver {
  private pubSub: PubSub;
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

  @Subscription((returns) => Message)
  async createdMessage() {
    console.log('tried to subscribe');
    console.log(pubSub.asyncIterator('createdMessage'));
    return pubSub.asyncIterator('createdMessage');
  }

  @ResolveField((returns) => [Room])
  async rooms(@Parent() user: User) {
    return await this.roomService.getAllRooms(user.id);
  }
}
