import { Module } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma.service';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';

@Module({
  imports: [],
  providers: [MessageService, PrismaService, RoomResolver, RoomService],
})
export class RoomModule {}
