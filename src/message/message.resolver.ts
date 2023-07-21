import {
  Args,
  Context,
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
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { useUser } from 'src/user/user.decorator';
import { Permissions } from 'src/permissions/permissions.decorator';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { GetMessageInput } from './model/inputs/getMessageInput';
import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/model/room.model';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private roomService: RoomService,
    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('SEND_MESSAGE')
  @Query((returns) => [Message])
  async messages(@Args('data') data: GetMessageInput) {
    return await this.messageService.findAllByRoom(data.room_id, data.orderBy);
  }

  @UseGuards(AuthGuard)
  @Subscription((returns) => Message)
  async roomsMessages(@useUser() user_id: number) {
    const userRoomsIds = (await this.roomService.getAllRooms(user_id)).map(
      (room) => `room_${room.id}`,
    );
    return this.pubSub.asyncIterator(userRoomsIds);
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
    this.pubSub.publish(`room_${data.room_id}`, { roomsMessages: message });
    return message;
  }

  @ResolveField((returns) => User, { name: 'user' })
  async getUser(@Parent() message: Message) {
    return await this.userService.findOneByID(message.user_id);
  }

  @UseGuards(AuthGuard)
  @ResolveField((returns) => Room, { name: 'room' })
  async getRoom(@Parent() message: Message, @useUser() user_id: number) {
    return await this.roomService.getRoomData(message.room_id, user_id);
  }
}
