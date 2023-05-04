import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomPermissions } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prismaService: PrismaService) {}
  async validatePermissions(
    user_id: number,
    requiredPermissions: RoomPermissions[],
    room_id: number,
  ): Promise<boolean> {
    const user = await this.prismaService.usersOnRooms.findUnique({
      where: { user_id_room_id: { room_id, user_id } },
    });

    if (!user)
      throw new BadRequestException(
        `User ${user_id} not found in the room ${room_id}`,
      );

    const hasPermission = user.permissions.some((permission) =>
      requiredPermissions.includes(permission),
    );

    if (!hasPermission)
      throw new UnauthorizedException(
        'User does not have permission required.',
      );

    return true;
  }
}
