/*
  Warnings:

  - You are about to drop the column `email` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Subscription` table. All the data in the column will be lost.
  - Made the column `name` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Subscription_email_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "email",
DROP COLUMN "password",
ALTER COLUMN "name" SET NOT NULL;
