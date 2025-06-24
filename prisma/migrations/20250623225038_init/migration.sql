-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEBIT', 'CREDIT', 'PAYPAL', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('Magazine', 'Software', 'Service', 'Professional', 'Other');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "provider" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "payment_period" INTEGER NOT NULL,
    "payment_amount" DECIMAL(65,30) NOT NULL,
    "is_recurring" BOOLEAN NOT NULL,
    "is_trial" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "subscription_type" "SubscriptionType" NOT NULL,
    "modification_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "name" TEXT NOT NULL,
    "expiry_date" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_key" ON "Subscription"("email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
