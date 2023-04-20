import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UsersResolver } from './user.resolver';
import { MessageService } from 'src/message/message.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [
    UserService,
    MessageService,
    PrismaService,
    UsersResolver,
    RoomService,
  ],
})
export class UserModule {}
