import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async findAllByRoom(room_id: number, orderBy = 'asc') {
    return await this.prismaService.message.findMany({
      where: { room_id },
      orderBy: { createdAt: orderBy === 'desc' ? 'desc' : 'asc' },
    });
  }

  async createMessage(
    data: Prisma.MessageUncheckedCreateInput,
  ): Promise<Message> {
    const room = await this.prismaService.room.findUnique({
      where: { id: data.room_id },
    });
    if (!room) throw new NotFoundException('Room not found');

    const user = await this.prismaService.user.findUnique({
      where: { id: data.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const userIsInRoom = await this.prismaService.usersOnRooms.findFirst({
      where: { user_id: data.user_id, room_id: data.room_id },
    });

    if (!userIsInRoom)
      throw new UnauthorizedException(
        "User isn't authorized to access the room",
      );

    return await this.prismaService.message.create({ data });
  }
}
