-- CreateTable
CREATE TABLE "farmHistory" (
    "id" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "cropYield" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "earned" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmHistory_pkey" PRIMARY KEY ("id")
);
