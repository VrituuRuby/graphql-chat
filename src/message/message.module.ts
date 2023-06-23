import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageResolver } from './message.resolver';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RoomService } from 'src/room/room.service';

@Module({
  imports: [UserModule],
  providers: [
    MessageService,
    PrismaService,
    MessageResolver,
    UserService,
    RoomService,
    PermissionsService,
  ],
})
export class MessageModule {}
