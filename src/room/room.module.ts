import { Module } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma.service';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';
import { UsersResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [],
  providers: [
    MessageService,
    PrismaService,
    RoomResolver,
    RoomService,
    UserService,
    PermissionsService,
  ],
})
export class RoomModule {}
