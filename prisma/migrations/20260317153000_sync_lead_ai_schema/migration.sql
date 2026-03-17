-- CreateEnum
CREATE TYPE "SearchStatus" AS ENUM ('DRAFT', 'QUEUED', 'RUNNING', 'PARTIAL', 'COMPLETE', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SearchJobStage" AS ENUM ('PARSE', 'SEARCH', 'DIRECTORY', 'ENRICH', 'AUDIT', 'CONTACTS', 'DEDUPE', 'SCORE', 'RANK', 'EXPORT');

-- CreateEnum
CREATE TYPE "SearchJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'PARTIAL', 'COMPLETE', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'XLSX');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETE', 'FAILED');

-- AlterTable
ALTER TABLE "otp_verifications" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "rawPrompt" TEXT NOT NULL,
    "status" "SearchStatus" NOT NULL DEFAULT 'DRAFT',
    "resultLimit" INTEGER NOT NULL DEFAULT 50,
    "sortBy" TEXT NOT NULL DEFAULT 'highest_opportunity',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "currentMessage" TEXT,
    "summary" JSONB,
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParsedQuery" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "serviceNeeds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "businessSize" TEXT,
    "contactPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "signals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "constraints" JSONB,
    "locationCountry" TEXT,
    "locationState" TEXT,
    "locationCity" TEXT,
    "language" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParsedQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchJob" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "stage" "SearchJobStage" NOT NULL,
    "connectorKey" TEXT,
    "status" "SearchJobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "logs" JSONB,
    "input" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "normalizedCompanyName" TEXT NOT NULL,
    "contactName" TEXT,
    "contactRole" TEXT,
    "businessEmail" TEXT,
    "businessPhone" TEXT,
    "website" TEXT,
    "domain" TEXT,
    "industry" TEXT,
    "subIndustry" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "googleRating" DOUBLE PRECISION,
    "reviewSummary" TEXT,
    "employeeSizeEstimate" TEXT,
    "revenueEstimateOptional" TEXT,
    "socialLinks" JSONB,
    "sourceUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "websiteQualityScore" INTEGER,
    "mobileFriendlinessScore" INTEGER,
    "seoScore" INTEGER,
    "brandingScore" INTEGER,
    "speedScore" INTEGER,
    "adActivitySignal" BOOLEAN NOT NULL DEFAULT false,
    "crmSignal" BOOLEAN NOT NULL DEFAULT false,
    "bookingSignal" BOOLEAN NOT NULL DEFAULT false,
    "outdatedWebsiteSignal" BOOLEAN NOT NULL DEFAULT false,
    "noWebsiteSignal" BOOLEAN NOT NULL DEFAULT false,
    "weakSocialPresenceSignal" BOOLEAN NOT NULL DEFAULT false,
    "painPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aiSummary" TEXT,
    "outreachAngle" TEXT,
    "bestOfferToPitch" TEXT,
    "coldOpenerLine" TEXT,
    "whyNow" TEXT,
    "priorityLevel" TEXT,
    "opportunityScore" INTEGER NOT NULL DEFAULT 0,
    "fitScore" INTEGER NOT NULL DEFAULT 0,
    "confidenceScore" INTEGER NOT NULL DEFAULT 0,
    "latestAudit" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSource" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "connectorName" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "fieldName" TEXT,
    "fieldValue" TEXT,
    "fieldConfidence" INTEGER,
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadScore" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "fitScore" INTEGER NOT NULL,
    "confidenceScore" INTEGER NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLead" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "defaultPitch" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignLead" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "addedBySearchId" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'queued',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadListLead" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "searchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadListLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Export" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "searchId" TEXT,
    "campaignId" TEXT,
    "listId" TEXT,
    "format" "ExportFormat" NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'QUEUED',
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "filters" JSONB,
    "errorMessage" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectorToggles" JSONB,
    "complianceText" TEXT,
    "enrichmentDepth" TEXT NOT NULL DEFAULT 'standard',
    "dedupeSettings" JSONB,
    "exportDefaults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Search_userId_status_createdAt_idx" ON "Search"("userId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedQuery_searchId_key" ON "ParsedQuery"("searchId");

-- CreateIndex
CREATE INDEX "SearchJob_searchId_status_stage_idx" ON "SearchJob"("searchId", "status", "stage");

-- CreateIndex
CREATE INDEX "Lead_normalizedCompanyName_idx" ON "Lead"("normalizedCompanyName");

-- CreateIndex
CREATE INDEX "Lead_domain_idx" ON "Lead"("domain");

-- CreateIndex
CREATE INDEX "Lead_country_state_city_idx" ON "Lead"("country", "state", "city");

-- CreateIndex
CREATE INDEX "LeadSource_leadId_connectorName_idx" ON "LeadSource"("leadId", "connectorName");

-- CreateIndex
CREATE INDEX "LeadScore_opportunityScore_fitScore_idx" ON "LeadScore"("opportunityScore", "fitScore");

-- CreateIndex
CREATE UNIQUE INDEX "LeadScore_searchId_leadId_key" ON "LeadScore"("searchId", "leadId");

-- CreateIndex
CREATE INDEX "SearchLead_searchId_rank_idx" ON "SearchLead"("searchId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "SearchLead_searchId_leadId_key" ON "SearchLead"("searchId", "leadId");

-- CreateIndex
CREATE INDEX "Campaign_userId_status_idx" ON "Campaign"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_userId_slug_key" ON "Campaign"("userId", "slug");

-- CreateIndex
CREATE INDEX "CampaignLead_campaignId_stage_idx" ON "CampaignLead"("campaignId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignLead_campaignId_leadId_key" ON "CampaignLead"("campaignId", "leadId");

-- CreateIndex
CREATE INDEX "LeadList_userId_createdAt_idx" ON "LeadList"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeadList_userId_slug_key" ON "LeadList"("userId", "slug");

-- CreateIndex
CREATE INDEX "LeadListLead_listId_createdAt_idx" ON "LeadListLead"("listId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeadListLead_listId_leadId_key" ON "LeadListLead"("listId", "leadId");

-- CreateIndex
CREATE INDEX "Export_userId_status_createdAt_idx" ON "Export"("userId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeadSettings_userId_key" ON "LeadSettings"("userId");

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedQuery" ADD CONSTRAINT "ParsedQuery_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchJob" ADD CONSTRAINT "SearchJob_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadSource" ADD CONSTRAINT "LeadSource_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadScore" ADD CONSTRAINT "LeadScore_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadScore" ADD CONSTRAINT "LeadScore_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLead" ADD CONSTRAINT "SearchLead_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLead" ADD CONSTRAINT "SearchLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLead" ADD CONSTRAINT "CampaignLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLead" ADD CONSTRAINT "CampaignLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLead" ADD CONSTRAINT "CampaignLead_addedBySearchId_fkey" FOREIGN KEY ("addedBySearchId") REFERENCES "Search"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadList" ADD CONSTRAINT "LeadList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadListLead" ADD CONSTRAINT "LeadListLead_listId_fkey" FOREIGN KEY ("listId") REFERENCES "LeadList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadListLead" ADD CONSTRAINT "LeadListLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadListLead" ADD CONSTRAINT "LeadListLead_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Export" ADD CONSTRAINT "Export_listId_fkey" FOREIGN KEY ("listId") REFERENCES "LeadList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadSettings" ADD CONSTRAINT "LeadSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

