-- DropIndex
DROP INDEX "UsersOnRooms_user_id_room_id_key";

-- AlterTable
ALTER TABLE "UsersOnRooms" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UsersOnRooms_pkey" PRIMARY KEY ("id");
