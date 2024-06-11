-- CreateTable
CREATE TABLE "user_agents" (
    "id" SERIAL NOT NULL,
    "raw" TEXT NOT NULL,
    "deviceModel" TEXT,
    "deviceVendor" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserAgent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_agents_raw_ip_key" ON "user_agents"("raw", "ip");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserAgent_AB_unique" ON "_UserToUserAgent"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserAgent_B_index" ON "_UserToUserAgent"("B");

-- CreateIndex
CREATE INDEX "fullName" ON "users"("firstName", "lastName");

-- AddForeignKey
ALTER TABLE "_UserToUserAgent" ADD CONSTRAINT "_UserToUserAgent_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserAgent" ADD CONSTRAINT "_UserToUserAgent_B_fkey" FOREIGN KEY ("B") REFERENCES "user_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
