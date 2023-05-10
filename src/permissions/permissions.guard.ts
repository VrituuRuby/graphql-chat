import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { RoomPermissions } from '@prisma/client';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<RoomPermissions[]>(
      'requiredPermissions',
      context.getHandler(),
    );

    const [_, args] = context.getArgs();
    const { data } = args;

    if (!requiredPermissions) return true;

    const { user } = GqlExecutionContext.create(context).getContext().req;

    const hasPermission = await this.permissionsService.validatePermissions(
      user.id,
      requiredPermissions,
      data.room_id,
    );

    if (hasPermission) return true;

    return false;
  }
}
