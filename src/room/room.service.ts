import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}
  async createRoom(data: Prisma.RoomCreateInput): Promise<Room> {
    return await this.prismaService.room.create({ data });
  }

  async getAllRooms(user_id: number): Promise<Room[]> {
    return await this.prismaService.room.findMany({
      where: { users: { some: { id: user_id } } },
    });
  }

  async getRoom(id: number): Promise<Room> {
    return await this.prismaService.room.findUnique({ where: { id } });
  }
}
