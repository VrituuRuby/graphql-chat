import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Room, User } from '@prisma/client';
import { error } from 'console';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}
  async createRoom(
    data: Prisma.RoomCreateInput,
    user_id: number,
  ): Promise<Room> {
    const room = await this.prismaService.room.create({
      data,
    });

    await this.prismaService.usersOnRooms.create({
      data: {
        user_id,
        room_id: room.id,
        permissions: ['OWNER', 'ADD_USERS', 'REMOVE_USERS', 'SEND_MESSAGE'],
      },
    });

    return room;
  }

  async getAllRooms(user_id: number): Promise<Room[]> {
    return await this.prismaService.room.findMany({
      where: { users: { some: { user: { id: user_id } } } },
    });
  }

  private async getRoom(id: number): Promise<Room> {
    const room = await this.prismaService.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async getRoomData(room_id: number, user_id: number) {
    const room = await this.getRoom(room_id);
    if (!room) throw new NotFoundException('Room not found');
    const userInRoom = await this.prismaService.usersOnRooms.findUnique({
      where: { user_id_room_id: { room_id, user_id } },
    });

    if (!userInRoom)
      throw new UnauthorizedException("User isn't allowed to access room");

    return room;
  }

  async addUserToRoom(user_id: number, room_id: number) {
    await this.getRoom(room_id);
    return await this.prismaService.usersOnRooms.create({
      data: { room_id, user_id, permissions: ['SEND_MESSAGE'] },
    });
  }

  async findUserInRoom(user_id: number, room_id: number) {
    const existingRecord = await this.prismaService.usersOnRooms.findUnique({
      where: { user_id_room_id: { user_id, room_id } },
    });

    return existingRecord;
  }

  async addManyUsersToRoom(users_ids: number[], room_id: number) {
    this.getRoom(room_id); // checks if room exists
    await Promise.all(
      users_ids.map(async (id) => {
        const existingRecord = await this.findUserInRoom(id, room_id);
        if (existingRecord) return;

        const user = await this.prismaService.user.findUnique({
          where: { id },
        });
        if (!user) return;

        await this.prismaService.usersOnRooms.create({
          data: { user_id: id, room_id, permissions: ['SEND_MESSAGE'] },
        });
      }),
    );
    return await this.getRoom(room_id);
  }

  async getUsersPermissions(room_id: number): Promise<PermissionsWithUser[]> {
    this.getRoom(room_id);
    const users = await this.prismaService.usersOnRooms.findMany({
      where: { room_id },
      include: { user: true },
    });
    return users;
  }
}

type PermissionsWithUser = Prisma.UsersOnRoomsGetPayload<{
  include: { user: true };
}>;
