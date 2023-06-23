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
import { CreateMessageInput } from './model/inputs/createMessageInput';
import { Message } from './model/message.model';
import { MessageService } from './message.service';
import { PubSub } from 'graphql-subscriptions';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { useUser } from 'src/user/user.decorator';
import { Permissions } from 'src/permissions/permissions.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { GetMessageInput } from './model/inputs/getMessageInput';
import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/model/room.model';

@Resolver((of) => Message)
export class MessageResolver {
  private pubSub: PubSub;
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private roomService: RoomService,
  ) {
    this.pubSub = new PubSub();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('SEND_MESSAGE')
  @Query((returns) => [Message])
  async messages(@Args('data') data: GetMessageInput) {
    return await this.messageService.findAllByRoom(data.room_id);
  }

  @Subscription((returns) => Message)
  async messageSended(
    @Args('room_ids', { type: () => [Int] }) room_ids: number[],
  ) {
    return this.pubSub.asyncIterator(room_ids.map((id) => `room_${id}`));
  }

  @Permissions('OWNER', 'SEND_MESSAGE')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Mutation((returns) => Message)
  async createMessage(
    @useUser() user_id: number,
    @Args('data') data: CreateMessageInput,
  ) {
    const message = await this.messageService.createMessage({
      ...data,
      user_id,
    });
    this.pubSub.publish(`room_${data.room_id}`, { messageSended: message });
    return message;
  }

  @ResolveField((returns) => User, { name: 'user' })
  async getUser(@Parent() message: Message) {
    return await this.userService.findOneByID(message.user_id);
  }

  @ResolveField((returns) => Room, { name: 'room' })
  async getRoom(@Parent() message: Message, @useUser() user_id: number) {
    return await this.roomService.getRoomData(message.room_id, user_id);
  }
}
