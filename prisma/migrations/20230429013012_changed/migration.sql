/*
  Warnings:

  - The `permissions` column on the `UsersOnRooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UsersOnRooms" DROP COLUMN "permissions",
ADD COLUMN     "permissions" TEXT[];
