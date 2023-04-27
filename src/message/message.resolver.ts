import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CreateMessageInput } from './model/inputs/createMessageInput';
import { Message } from './model/message.model';
import { MessageService } from './message.service';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class MessageResolver {
  private pubSub: PubSub;
  constructor(private messageService: MessageService) {
    this.pubSub = new PubSub();
  }

  @Query((returns) => [Message])
  async messages(@Args('room_id', { type: () => Int }) room_id: number) {
    return await this.messageService.findAllByRoom(room_id);
  }

  @Subscription((returns) => Message)
  async createdMessage() {
    return this.pubSub.asyncIterator('createdMessage');
  }

  @Mutation((returns) => Message)
  async createMessage(@Args('data') data: CreateMessageInput) {
    const message = await this.messageService.createMessage(data);
    this.pubSub.publish('createdMessage', { createdMessage: message });
    return message;
  }
}
