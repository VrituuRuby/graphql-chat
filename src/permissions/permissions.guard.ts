import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { RoomPermissions } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<RoomPermissions[]>(
      'requiredPermissions',
      context.getHandler(),
    );

    if (!requiredPermissions) return true;

    const { user } = GqlExecutionContext.create(context).getContext().req;

    return true;
  }
}
