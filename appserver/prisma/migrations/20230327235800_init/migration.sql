-- CreateTable
CREATE TABLE "DummyRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DummyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DummyRecord_name_key" ON "DummyRecord"("name");
