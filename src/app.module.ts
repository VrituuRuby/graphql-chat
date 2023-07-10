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
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { PermissionsService } from './permissions/permissions.service';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws';

@Module({
  imports: [
    UserModule,
    MessageModule,
    RoomModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: Context<any, { access_token: string }>) => {
            const { connectionParams, extra } = context;
            extra.access_token = connectionParams.access_token;
          },
        },
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            return { access_token: connectionParams.access_token };
          },
        },
      },
    }),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    MessageService,
    PrismaService,
    RoomService,
    MessageResolver,
    UserService,
    PermissionsService,
    { provide: 'PUB_SUB', useValue: new PubSub() },
  ],
})
export class AppModule {}
