-- CreateTable
CREATE TABLE `RoleOnUser` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    INDEX `RoleOnUser_roleId_idx`(`roleId`),
    INDEX `RoleOnUser_userId_idx`(`userId`),
    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PermissionOnRole` (
    `permissionId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    INDEX `PermissionOnRole_roleId_idx`(`roleId`),
    INDEX `PermissionOnRole_permissionId_idx`(`permissionId`),
    PRIMARY KEY (`permissionId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
