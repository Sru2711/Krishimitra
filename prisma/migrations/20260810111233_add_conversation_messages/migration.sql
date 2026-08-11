-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "messages" JSONB NOT NULL DEFAULT '[]';
