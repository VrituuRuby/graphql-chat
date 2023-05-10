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

  async updateUserPermissions(
    room_id: number,
    user_id: number,
    permission: RoomPermissions[],
  ) {
    const room = await this.prismaService.room.findUnique({
      where: { id: room_id },
    });
    if (!room) throw new BadRequestException('Room not found');

    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });
    if (!user) throw new BadRequestException('User not found');

    const userOnRoom = await this.prismaService.usersOnRooms.findUnique({
      where: { user_id_room_id: { user_id, room_id } },
    });

    if (!userOnRoom)
      throw new UnauthorizedException("User isn't allowed to access room");

    return this.prismaService.usersOnRooms.update({
      where: { user_id_room_id: { room_id, user_id } },
      data: {
        permissions: permission,
      },
    });
  }
}
