import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoomPermissions } from '@prisma/client';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [_, args] = context.getArgs();
    const { data } = args;
    const { user } = GqlExecutionContext.create(context).getContext().req;

    console.log(args);
    await this.permissionsService.validateUserOnRoom(user.id, data.room_id);

    const requiredPermissions = this.reflector.get<RoomPermissions[]>(
      'requiredPermissions',
      context.getHandler(),
    );

    if (requiredPermissions.length === 0) return true;

    const hasPermission = await this.permissionsService.validatePermissions(
      user.id,
      requiredPermissions,
      data.room_id,
    );

    if (hasPermission) return true;

    return false;
  }
}
