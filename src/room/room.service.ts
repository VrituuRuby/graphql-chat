import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}
  async createRoom(data: Prisma.RoomCreateInput): Promise<Room> {
    return await this.prismaService.room.create({
      data,
    });
  }

  async getAllRooms(user_id: number): Promise<Room[]> {
    return await this.prismaService.room.findMany({
      where: { users: { some: { user: { id: user_id } } } },
    });
  }

  async getRoom(id: number): Promise<Room> {
    const room = await this.prismaService.room.findUnique({ where: { id } });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async addUserToRoom(user_id: number, room_id: number) {
    await this.getRoom(room_id);
    return await this.prismaService.usersOnRooms.create({
      data: { room_id, user_id, permissions: 'sendMessages;' },
    });
  }

  async addManyUsersToRoom(users_ids: number[], room_id: number) {
    await this.prismaService.usersOnRooms.createMany({
      data: users_ids.map((id) => ({ room_id, user_id: id })),
    });
  }
}
