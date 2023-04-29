import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CreateMessageInput } from './model/inputs/createMessageInput';
import { Message } from './model/message.model';
import { MessageService } from './message.service';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/models/user.model';

@Resolver((of) => Message)
export class MessageResolver {
  private pubSub: PubSub;
  constructor(
    private messageService: MessageService,
    private userService: UserService,
  ) {
    this.pubSub = new PubSub();
  }

  @Query((returns) => [Message])
  async messages(@Args('room_id', { type: () => Int }) room_id: number) {
    return await this.messageService.findAllByRoom(room_id);
  }

  @Subscription((returns) => Message)
  async messageSended(
    @Args('room_ids', { type: () => [Int] }) room_ids: number[],
  ) {
    return this.pubSub.asyncIterator(room_ids.map((id) => `room_${id}`));
  }

  @Mutation((returns) => Message)
  async createMessage(@Args('data') data: CreateMessageInput) {
    const message = await this.messageService.createMessage(data);
    this.pubSub.publish(`room_${data.room_id}`, { messageSended: message });
    return message;
  }

  @ResolveField((returns) => User, { name: 'user' })
  async getUser(@Parent() message: Message) {
    return await this.userService.findOneByID(message.user_id);
  }
}
