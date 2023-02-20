/*
  Warnings:

  - Added the required column `hotel_id` to the `HotelImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `HotelImages` ADD COLUMN `hotel_id` INTEGER NOT NULL;
