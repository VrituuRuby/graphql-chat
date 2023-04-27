import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { MessageService } from './message/message.service';
import { PrismaService } from './prisma.service';
import { RoomService } from './room/room.service';
import { MessageResolver } from './message/message.resolver';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        'subscriptions-transport-ws': {
          path: '/graphql',
        },
      },
    }),
    UserModule,
    MessageModule,
    RoomModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageService,
    PrismaService,
    RoomService,
    MessageResolver,
  ],
})
export class AppModule {}
