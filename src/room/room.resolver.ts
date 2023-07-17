import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/model/message.model';
import { RoomService } from './room.service';
import { Room } from './model/room.model';
import { User } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';
import { CreateRoomInput } from './model/inputs/createRoomInput';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { useUser } from 'src/user/user.decorator';
import { AddUsersToRoomInput } from './model/inputs/addUsersToRoomInput';
import { UserPermissions } from './model/userPermissions.model';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permissions } from 'src/permissions/permissions.decorator';
import { UpdateUserPermissionsInput } from './model/inputs/updateUserPermissionsInput';

@Resolver((of) => Room)
export class RoomResolver {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private roomService: RoomService,
    private permissionsService: PermissionsService,
  ) {}

  @UseGuards(AuthGuard)
  @Query((returns) => [Room])
  async rooms(@useUser() user_id: number) {
    return this.roomService.getAllRooms(user_id);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Room)
  async room(
    @Args('id', { type: () => Int }) id: number,
    @useUser('id') user_id: number,
  ) {
    return await this.roomService.getRoomData(id, user_id);
  }

  @ResolveField((returns) => [User], { name: 'users' })
  async getUsersByRooms(@Parent() room: Room) {
    return await this.userService.findAllByRoomID(room.id);
  }

  @ResolveField((returns) => [Message])
  async messages(
    @Parent() room: Room,
    @Args('orderBy', { type: () => String }) orderBy: string,
  ) {
    return this.messageService.findAllByRoom(room.id, orderBy);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Room)
  async createRoom(
    @Args('data') data: CreateRoomInput,
    @useUser() user_id: number,
  ) {
    const room = await this.roomService.createRoom(
      { name: data.name },
      user_id,
    );

    if (data.users_ids) {
      await this.roomService.addManyUsersToRoom(data.users_ids, room.id);
    }
    return room;
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('ADD_USERS', 'OWNER')
  @Mutation(() => Room, { name: 'addUsersToRoom' })
  async addUsersToExistingRoom(
    @Args('data') data: AddUsersToRoomInput,
    @useUser() id: number,
  ) {
    const hasPermission = await this.permissionsService.validatePermissions(
      id,
      ['OWNER', 'ADD_USERS'],
      data.room_id,
    );

    if (hasPermission)
      return await this.roomService.addManyUsersToRoom(
        data.users_ids,
        data.room_id,
      );
  }

  @ResolveField(() => [UserPermissions])
  async usersPermissions(@Parent() room: Room) {
    return await this.roomService.getUsersPermissions(room.id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('OWNER')
  @Mutation(() => UserPermissions)
  async updateUserPermissions(@Args('data') data: UpdateUserPermissionsInput) {
    return await this.permissionsService.updateUserPermissions(
      data.room_id,
      data.user_id,
      data.permissions,
    );
  }
}
