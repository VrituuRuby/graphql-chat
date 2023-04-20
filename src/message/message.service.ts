import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}
  async findAll(user_id: number) {
    return await this.prismaService.message.findMany({ where: { user_id } });
  }
}
