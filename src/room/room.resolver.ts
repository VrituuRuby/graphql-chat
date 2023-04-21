import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/model/message.model';
import { RoomService } from './room.service';
import { Room } from './model/room.model';

@Resolver((of) => Room)
export class RoomResolver {
  constructor(
    private messageService: MessageService,
    private roomService: RoomService,
  ) {}

  @Query((returns) => Room)
  async room(@Args('id', { type: () => Int }) id: number) {
    return await this.roomService.getRoom(id);
  }

  @ResolveField((returns) => [Message])
  async messages(@Parent() room: Room) {
    return this.messageService.findAllByRoom(room.id);
  }
}
