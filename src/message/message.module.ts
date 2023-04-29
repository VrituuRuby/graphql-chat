import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma.service';
import { MessageResolver } from './message.resolver';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [MessageService, PrismaService, MessageResolver, UserService],
})
export class MessageModule {}
