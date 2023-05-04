import { SetMetadata } from '@nestjs/common';
import { RoomPermissions } from '@prisma/client';

export const Permissions = (...requiredPermissions: RoomPermissions[]) =>
  SetMetadata('requiredPermissions', requiredPermissions);
