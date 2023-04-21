import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateMessageInput } from './model/inputs/createMessageInput';
import { Message } from './model/message.model';
import { MessageService } from './message.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Mutation((returns) => Message)
  async createMessage(@Args('data') data: CreateMessageInput) {
    const message = await this.messageService.createMessage(data);
    pubSub.publish('messageCreated', { messageCreated: message });
    console.log(message);
    return message;
  }
}
