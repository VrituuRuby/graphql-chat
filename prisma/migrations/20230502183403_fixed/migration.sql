/*
  Warnings:

  - The primary key for the `UsersOnRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UsersOnRooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,room_id]` on the table `UsersOnRooms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UsersOnRooms" DROP CONSTRAINT "UsersOnRooms_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnRooms_user_id_room_id_key" ON "UsersOnRooms"("user_id", "room_id");
