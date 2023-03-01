/*
  Warnings:

  - A unique constraint covering the columns `[hotelId,number]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[floorId,number]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId,name]` on the table `RoomType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Floor_hotelId_number_key` ON `Floor`(`hotelId`, `number`);

-- CreateIndex
CREATE UNIQUE INDEX `Hotel_name_key` ON `Hotel`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_floorId_number_key` ON `Room`(`floorId`, `number`);

-- CreateIndex
CREATE UNIQUE INDEX `RoomType_hotelId_name_key` ON `RoomType`(`hotelId`, `name`);
