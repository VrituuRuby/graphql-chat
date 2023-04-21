import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageResolver } from './message.resolver';

@Module({ providers: [MessageService, PrismaService, MessageResolver] })
export class MessageModule {}
