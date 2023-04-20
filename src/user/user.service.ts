import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async findOneByID(id: number) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      include: { rooms: true, messages: true },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const emailExists = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (emailExists)
      throw new BadRequestException('This email is already being used!');

    return await this.prismaService.user.create({
      data,
      include: { messages: true, rooms: true },
    });
  }
}
