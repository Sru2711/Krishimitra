-- CreateTable
CREATE TABLE "soilData" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "soilType" TEXT,
    "fertilityLevel" INTEGER,
    "soilPH" DECIMAL(3,1),
    "organicCarbon" DECIMAL(5,2),
    "clayPercentage" DECIMAL(5,2),
    "sandPercentage" DECIMAL(5,2),
    "siltPercentage" DECIMAL(5,2),
    "cationExchangeCapacity" DECIMAL(5,2),
    "nitrogen" DECIMAL(5,2),
    "bulkDensity" DECIMAL(5,2),
    "coarseFragments" DECIMAL(5,2),
    "apiProvider" TEXT DEFAULT 'ISRIC SoilGrids',
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soilData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "soilData" ADD CONSTRAINT "soilData_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "farmers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
