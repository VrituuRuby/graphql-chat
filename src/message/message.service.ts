import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma.service';

const pubSub = new PubSub();

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}
  async findAllByRoom(room_id: number) {
    return await this.prismaService.message.findMany({ where: { room_id } });
  }

  async createMessage(data: Prisma.MessageUncheckedCreateInput) {
    const message = await this.prismaService.message.create({ data });
    console.log(message);

    return message;
  }
}
