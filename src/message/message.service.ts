import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}
  async findAllByRoom(room_id: number) {
    return await this.prismaService.message.findMany({ where: { room_id } });
  }

  async createMessage(data: Prisma.MessageUncheckedCreateInput) {
    return await this.prismaService.message.create({ data });
  }
}
