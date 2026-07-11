-- CreateTable
CREATE TABLE "farmers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "state" TEXT,
    "district" TEXT,
    "pincode" TEXT,
    "farmerType" TEXT,
    "landHolding" DOUBLE PRECISION,
    "primaryCrop" TEXT,
    "aadharHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "farmers_mobile_key" ON "farmers"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "farmers_email_key" ON "farmers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farmers_aadharHash_key" ON "farmers"("aadharHash");
