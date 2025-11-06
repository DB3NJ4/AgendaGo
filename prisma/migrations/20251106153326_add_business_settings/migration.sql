-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "bookingLeadTime" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "cancellationPolicy" INTEGER NOT NULL DEFAULT 24,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Santiago';
