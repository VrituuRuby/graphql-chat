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

  async validateUserOnRoom(user_id: number, room_id: number) {
    const userOnRoom = await this.prismaService.usersOnRooms.findUnique({
      where: { user_id_room_id: { room_id, user_id } },
    });
    if (!userOnRoom)
      throw new UnauthorizedException(
        `User ${user_id} isn't part of the room ${room_id}`,
      );
    return true;
  }

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
    permissions: RoomPermissions[],
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

    const uniquePermissions = [...new Set(permissions)];

    if (
      await this.validatePermissionsViolations(
        room_id,
        user_id,
        uniquePermissions,
      )
    )
      return this.prismaService.usersOnRooms.update({
        where: { user_id_room_id: { room_id, user_id } },
        data: {
          permissions: uniquePermissions,
        },
        include: {
          user: true,
          room: true,
        },
      });
  }

  private async validatePermissionsViolations(
    room_id: number,
    user_id: number,
    updatedPermissions: RoomPermissions[],
  ) {
    const owner = await this.prismaService.usersOnRooms.findFirst({
      where: { room_id, permissions: { hasSome: 'OWNER' } },
      include: { user: true },
    });

    if (user_id !== owner.user_id) return true;

    const hasOwnerInPermissions = updatedPermissions.find(
      (permission) => permission === 'OWNER',
    );

    if (hasOwnerInPermissions === undefined)
      throw new BadRequestException(
        "Owner user can't self remove OWNER permission",
      );
    return true;
  }
}
