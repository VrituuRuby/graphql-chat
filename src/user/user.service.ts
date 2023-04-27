import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async findOneByID(id: number): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists) throw new NotFoundException('User not found');
    return userExists;
  }

  async findAllByRoomID(room_id: number) {
    const room = await this.prismaService.room.findUnique({
      where: { id: room_id },
    });

    if (!room) throw new NotFoundException('Room not found');

    const users = await this.prismaService.user.findMany({
      where: { rooms: { some: { id: room_id } } },
    });

    return users;
  }

  async findAll(): Promise<User[]> {
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
      data: {
        ...data,
        password: await hash(data.password, 8),
      },
    });
  }
}
