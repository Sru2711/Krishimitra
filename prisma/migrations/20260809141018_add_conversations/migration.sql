-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_farmerId_idx" ON "Conversation"("farmerId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "farmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
