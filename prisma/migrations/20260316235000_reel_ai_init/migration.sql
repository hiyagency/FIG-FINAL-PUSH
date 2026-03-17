-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('PERSONAL', 'TEAM', 'AGENCY');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'STRATEGIST', 'APPROVER', 'VIEWER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetKind" AS ENUM ('RAW_VIDEO', 'PROXY_VIDEO', 'AUDIO', 'IMAGE', 'LOGO', 'MUSIC', 'BROLL', 'TEMPLATE', 'COVER', 'THUMBNAIL', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "AssetSource" AS ENUM ('USER_UPLOAD', 'GENERATED', 'INTERNAL_LIBRARY', 'IMPORTED_SOCIAL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TranscriptStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "DiagnosisStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "QuestionnaireStatus" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ANALYZING', 'PLANNING', 'RENDERING', 'REVIEW', 'READY', 'PUBLISHED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('DRAFT', 'RENDERING', 'READY', 'APPROVED', 'LOCKED', 'FAILED');

-- CreateEnum
CREATE TYPE "EditOperationType" AS ENUM ('TRIM', 'CUT', 'REFRAME', 'SUBTITLE_STYLE', 'TEXT_OVERLAY', 'AUDIO_DUCK', 'CTA_CARD', 'WATERMARK', 'BROLL', 'TRANSITION', 'FILTER', 'LOUDNESS', 'VOICE_ENHANCEMENT', 'PROMPT_REWRITE', 'TEMPLATE_APPLY', 'COVER_FRAME', 'CUSTOM');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('AD', 'ORGANIC', 'TREND', 'AUTHORITY', 'MINIMAL', 'FAST_CUT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RenderStatus" AS ENUM ('QUEUED', 'PROCESSING', 'READY', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TemplateVisibility" AS ENUM ('INTERNAL', 'TEAM', 'PRIVATE', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "PublishPlatform" AS ENUM ('INSTAGRAM');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'QUEUED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELED', 'NEEDS_ATTENTION');

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'RUNNING', 'COMPLETED', 'PROMOTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED', 'LOCKED');

-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('OPEN', 'PENDING_APPROVAL', 'NEEDS_HUMAN', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ThreadChannel" AS ENUM ('COMMENT', 'DM');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'RISKY');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'AGENCY', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "UsageMetric" AS ENUM ('STORAGE_GB', 'RENDER_MINUTES', 'TRANSCRIPT_MINUTES', 'AI_TOKENS', 'SOCIAL_PUBLISHES', 'TEAM_SEATS');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('USER', 'SYSTEM', 'API');

-- CreateEnum
CREATE TYPE "HookStyle" AS ENUM ('DIRECT', 'CURIOSITY', 'CONTRARIAN', 'AUTHORITY', 'STORY', 'PROBLEM_SOLUTION', 'SOCIAL_PROOF');

-- CreateEnum
CREATE TYPE "CaptionTone" AS ENUM ('PREMIUM', 'PLAYFUL', 'DIRECT_RESPONSE', 'AUTHORITY', 'EDUCATIONAL');

-- CreateEnum
CREATE TYPE "FunnelGoal" AS ENUM ('VIEWS', 'FOLLOWERS', 'LEADS', 'BOOKINGS', 'DMS', 'APP_INSTALLS', 'SALES');

-- CreateEnum
CREATE TYPE "ContentIntent" AS ENUM ('EDUCATIONAL', 'AUTHORITY', 'PROMOTIONAL', 'STORYTELLING', 'ENTERTAINMENT', 'TESTIMONIAL', 'UGC');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'DLQ');

-- CreateEnum
CREATE TYPE "SocialAccountStatus" AS ENUM ('CONNECTED', 'EXPIRED', 'REVOKED', 'ERROR');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('CREDENTIALS', 'EMAIL', 'GOOGLE', 'INSTAGRAM', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "PublishMode" AS ENUM ('STANDARD', 'INTERNAL_EXPERIMENT', 'PLATFORM_TRIAL');

-- CreateEnum
CREATE TYPE "ModerationDecision" AS ENUM ('ALLOW', 'REVIEW', 'HIDE', 'BLOCK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "locale" TEXT DEFAULT 'en',
    "timezone" TEXT DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "WorkspaceType" NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceInvitation" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'INVITED',
    "token" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT,
    "offerType" TEXT,
    "targetAudience" TEXT,
    "postingLanguage" TEXT DEFAULT 'en',
    "complianceNotes" TEXT,
    "approvalRulesSummary" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandDnaProfile" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "niche" TEXT,
    "offerType" TEXT,
    "targetAudience" TEXT,
    "preferredCaptionStyle" TEXT,
    "preferredHookStyle" TEXT,
    "pacingStyle" TEXT,
    "transitionAggressiveness" INTEGER NOT NULL DEFAULT 40,
    "subtitleStyle" JSONB,
    "fontPreferences" JSONB,
    "colorPalette" JSONB,
    "logoAssetIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaTone" TEXT,
    "bannedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audioVibe" TEXT,
    "platformGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "postingLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "complianceNotes" TEXT,
    "approvalRules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandDnaProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedSocialAccount" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "provider" "PublishPlatform" NOT NULL,
    "status" "SocialAccountStatus" NOT NULL DEFAULT 'CONNECTED',
    "username" TEXT,
    "accountLabel" TEXT,
    "externalAccountId" TEXT NOT NULL,
    "encryptedAccessToken" TEXT NOT NULL,
    "encryptedRefreshToken" TEXT,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expiresAt" TIMESTAMP(3),
    "capabilities" JSONB,
    "errorState" JSONB,
    "lastValidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectedSocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT,
    "createdById" TEXT,
    "kind" "AssetKind" NOT NULL,
    "source" "AssetSource" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPLOADING',
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "checksumSha256" TEXT,
    "sizeBytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "durationMs" INTEGER,
    "metadata" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duplicateOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "proxyAssetId" TEXT,
    "thumbnailAssetId" TEXT,
    "waveformAssetId" TEXT,
    "ingestStatus" "AssetStatus" NOT NULL DEFAULT 'PROCESSING',
    "aspectRatio" TEXT,
    "orientation" TEXT,
    "durationMs" INTEGER,
    "fps" DOUBLE PRECISION,
    "loudnessLufs" DOUBLE PRECISION,
    "sceneMarkers" JSONB,
    "silenceMarkers" JSONB,
    "speakerTurns" JSONB,
    "faceRegions" JSONB,
    "metadataExtracted" JSONB,
    "duplicateSignature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "mediaFileId" TEXT NOT NULL,
    "status" "TranscriptStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "language" TEXT,
    "confidence" DOUBLE PRECISION,
    "rawText" TEXT,
    "segments" JSONB,
    "words" JSONB,
    "speakerMap" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentDiagnosis" (
    "id" TEXT NOT NULL,
    "mediaFileId" TEXT NOT NULL,
    "status" "DiagnosisStatus" NOT NULL DEFAULT 'PENDING',
    "nicheDetected" TEXT,
    "contentIntent" "ContentIntent",
    "likelyPlatformFit" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emotionalTone" TEXT,
    "speakerEnergyScore" DOUBLE PRECISION,
    "hookStrengthScore" DOUBLE PRECISION,
    "ctaPresenceScore" DOUBLE PRECISION,
    "productMentionScore" DOUBLE PRECISION,
    "facePresenceScore" DOUBLE PRECISION,
    "sceneChangeFrequency" DOUBLE PRECISION,
    "deadAirRatio" DOUBLE PRECISION,
    "retentionRiskScore" DOUBLE PRECISION,
    "adLikeVsOrganicScore" DOUBLE PRECISION,
    "evergreenPotentialScore" DOUBLE PRECISION,
    "strongestAngles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weakPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendedReelTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendedEditingStyle" TEXT,
    "bestAspectSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bestPlatformSuggestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "structuredOutput" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionnaireResponse" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT,
    "projectId" TEXT,
    "sourceDiagnosisId" TEXT,
    "createdById" TEXT,
    "status" "QuestionnaireStatus" NOT NULL DEFAULT 'DRAFT',
    "askedQuestions" JSONB,
    "answers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionnaireResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "sourceMediaId" TEXT NOT NULL,
    "diagnosisId" TEXT,
    "questionnaireId" TEXT,
    "currentVersionId" TEXT,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "funnelGoal" "FunnelGoal" NOT NULL,
    "contentIntent" "ContentIntent",
    "preferredLanguage" TEXT,
    "requestedVariantCount" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectVersion" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "templateVersionId" TEXT,
    "versionNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "editDecisionList" JSONB,
    "renderPlan" JSONB,
    "subtitleTrack" JSONB,
    "overlayTrack" JSONB,
    "audioTrack" JSONB,
    "coverFrameMs" INTEGER,
    "promptContext" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditOperation" (
    "id" TEXT NOT NULL,
    "projectVersionId" TEXT NOT NULL,
    "operationType" "EditOperationType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "summary" TEXT,
    "payload" JSONB NOT NULL,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedVariant" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectVersionId" TEXT NOT NULL,
    "renderAssetId" TEXT,
    "coverAssetId" TEXT,
    "renderJobId" TEXT,
    "variantType" "VariantType" NOT NULL,
    "name" TEXT NOT NULL,
    "renderStatus" "RenderStatus" NOT NULL DEFAULT 'QUEUED',
    "hookStrategy" TEXT,
    "pacingStyle" TEXT,
    "captionTreatment" TEXT,
    "ctaFraming" TEXT,
    "thumbnailSuggestion" TEXT,
    "platformRecommendation" TEXT,
    "confidenceNotes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "outputDurationMs" INTEGER,
    "renderCostUsd" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "brandId" TEXT,
    "createdById" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "TemplateVisibility" NOT NULL DEFAULT 'PRIVATE',
    "idealNiches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "complexityScore" INTEGER NOT NULL DEFAULT 1,
    "pacingStyle" TEXT,
    "captionStyle" TEXT,
    "transitions" JSONB,
    "textAnimationStyle" TEXT,
    "audioMood" TEXT,
    "ctaPattern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateVersion" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changelog" TEXT,
    "data" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptionPackage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "variantId" TEXT,
    "tone" "CaptionTone",
    "primaryCaption" TEXT NOT NULL,
    "shortCaption" TEXT,
    "longCaption" TEXT,
    "platformCaptions" JSONB,
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryKeyword" TEXT,
    "secondaryKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "coverText" TEXT,
    "pinnedComment" TEXT,
    "ctaText" TEXT,
    "audienceAngle" TEXT,
    "postingNotes" TEXT,
    "engagementPrompts" JSONB,
    "alternativeTones" JSONB,
    "whyThisMayWork" TEXT,
    "readabilityScore" DOUBLE PRECISION,
    "riskWarnings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overuseWarnings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "originalityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaptionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HookPackage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "variantId" TEXT,
    "style" "HookStyle",
    "businessGoal" "FunnelGoal" NOT NULL,
    "hookLines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "openingTextOverlays" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaEndings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pinnedCommentIdeas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "headlineOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HookPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishJob" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "platform" "PublishPlatform" NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "mode" "PublishMode" NOT NULL DEFAULT 'STANDARD',
    "scheduledFor" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "timezone" TEXT,
    "preflightReport" JSONB,
    "auditTrail" JSONB,
    "platformResponse" JSONB,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedPost" (
    "id" TEXT NOT NULL,
    "publishJobId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "socialAccountId" TEXT,
    "platform" "PublishPlatform" NOT NULL,
    "remotePostId" TEXT NOT NULL,
    "permalink" TEXT,
    "thumbnailUrl" TEXT,
    "captionSnapshot" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "projectId" TEXT,
    "variantId" TEXT,
    "publishedPostId" TEXT,
    "platform" "PublishPlatform" NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "watchTimeMs" INTEGER NOT NULL DEFAULT 0,
    "averageWatchDurationMs" INTEGER NOT NULL DEFAULT 0,
    "retentionDropoffHints" JSONB,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "profileVisits" INTEGER NOT NULL DEFAULT 0,
    "follows" INTEGER NOT NULL DEFAULT 0,
    "dmsTriggered" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "captionLength" INTEGER,
    "hookStyle" TEXT,
    "subtitleStyle" TEXT,
    "pacingStyle" TEXT,
    "templateFamily" TEXT,
    "ctaFamily" TEXT,
    "rawMetrics" JSONB,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentRun" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "baselineVariantId" TEXT,
    "winnerVariantId" TEXT,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "goal" "FunnelGoal" NOT NULL,
    "hypothesis" TEXT,
    "strategy" JSONB,
    "notes" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperimentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "variantId" TEXT,
    "lockedVersionId" TEXT,
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewLinkToken" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3),
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalComment" (
    "id" TEXT NOT NULL,
    "approvalRequestId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "body" TEXT NOT NULL,
    "marker" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementThread" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "socialAccountId" TEXT,
    "platformThreadId" TEXT NOT NULL,
    "channel" "ThreadChannel" NOT NULL,
    "status" "ThreadStatus" NOT NULL DEFAULT 'OPEN',
    "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL',
    "leadIntentScore" DOUBLE PRECISION DEFAULT 0,
    "assignedToId" TEXT,
    "contactHandle" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngagementThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentEvent" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "socialCommentId" TEXT NOT NULL,
    "authorHandle" TEXT,
    "authorDisplayName" TEXT,
    "message" TEXT NOT NULL,
    "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL',
    "moderationDecision" "ModerationDecision" NOT NULL DEFAULT 'REVIEW',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DmEvent" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "socialDmId" TEXT NOT NULL,
    "authorHandle" TEXT,
    "authorDisplayName" TEXT,
    "message" TEXT NOT NULL,
    "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL',
    "moderationDecision" "ModerationDecision" NOT NULL DEFAULT 'REVIEW',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DmEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationEvent" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "brandId" TEXT,
    "userId" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "eventType" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "payload" JSONB,
    "dedupeKey" TEXT,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageCounter" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "metric" "UsageMetric" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "included" DECIMAL(12,2) NOT NULL,
    "consumed" DECIMAL(12,2) NOT NULL,
    "overage" DECIMAL(12,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "brandId" TEXT,
    "actorType" "AuditActorType" NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthMemory" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "winningHooks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "winningCaptionTones" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "winningCtaTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "winningDurationRanges" JSONB,
    "winningPostWindows" JSONB,
    "winningStylesByGoal" JSONB,
    "recommendations" JSONB,
    "refreshedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedReply" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "brandId" TEXT,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "triggerKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "channel" "ThreadChannel" NOT NULL,
    "body" TEXT NOT NULL,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundJob" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT,
    "brandId" TEXT,
    "projectId" TEXT,
    "createdById" TEXT,
    "queueName" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "externalJobId" TEXT,
    "idempotencyKey" TEXT,
    "payload" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "costUsd" DECIMAL(10,2),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordCredential_userId_key" ON "PasswordCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_role_idx" ON "WorkspaceMember"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceInvitation_token_key" ON "WorkspaceInvitation"("token");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_workspaceId_email_idx" ON "WorkspaceInvitation"("workspaceId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_workspaceId_slug_key" ON "Brand"("workspaceId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "BrandDnaProfile_brandId_key" ON "BrandDnaProfile"("brandId");

-- CreateIndex
CREATE INDEX "ConnectedSocialAccount_workspaceId_brandId_status_idx" ON "ConnectedSocialAccount"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectedSocialAccount_provider_externalAccountId_key" ON "ConnectedSocialAccount"("provider", "externalAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_storageKey_key" ON "Asset"("storageKey");

-- CreateIndex
CREATE INDEX "Asset_workspaceId_brandId_kind_status_idx" ON "Asset"("workspaceId", "brandId", "kind", "status");

-- CreateIndex
CREATE INDEX "Asset_checksumSha256_idx" ON "Asset"("checksumSha256");

-- CreateIndex
CREATE UNIQUE INDEX "MediaFile_assetId_key" ON "MediaFile"("assetId");

-- CreateIndex
CREATE INDEX "MediaFile_duplicateSignature_idx" ON "MediaFile"("duplicateSignature");

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_mediaFileId_key" ON "Transcript"("mediaFileId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentDiagnosis_mediaFileId_key" ON "ContentDiagnosis"("mediaFileId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireResponse_projectId_key" ON "QuestionnaireResponse"("projectId");

-- CreateIndex
CREATE INDEX "QuestionnaireResponse_workspaceId_brandId_status_idx" ON "QuestionnaireResponse"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_questionnaireId_key" ON "Project"("questionnaireId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_currentVersionId_key" ON "Project"("currentVersionId");

-- CreateIndex
CREATE INDEX "Project_workspaceId_brandId_status_idx" ON "Project"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE INDEX "ProjectVersion_projectId_status_idx" ON "ProjectVersion"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectVersion_projectId_versionNumber_key" ON "ProjectVersion"("projectId", "versionNumber");

-- CreateIndex
CREATE INDEX "EditOperation_idempotencyKey_idx" ON "EditOperation"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "EditOperation_projectVersionId_sequence_key" ON "EditOperation"("projectVersionId", "sequence");

-- CreateIndex
CREATE INDEX "GeneratedVariant_projectId_variantType_renderStatus_idx" ON "GeneratedVariant"("projectId", "variantType", "renderStatus");

-- CreateIndex
CREATE INDEX "Template_workspaceId_brandId_visibility_idx" ON "Template"("workspaceId", "brandId", "visibility");

-- CreateIndex
CREATE UNIQUE INDEX "Template_createdById_slug_key" ON "Template"("createdById", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_templateId_versionNumber_key" ON "TemplateVersion"("templateId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CaptionPackage_variantId_key" ON "CaptionPackage"("variantId");

-- CreateIndex
CREATE INDEX "CaptionPackage_projectId_tone_idx" ON "CaptionPackage"("projectId", "tone");

-- CreateIndex
CREATE UNIQUE INDEX "HookPackage_variantId_key" ON "HookPackage"("variantId");

-- CreateIndex
CREATE INDEX "HookPackage_projectId_businessGoal_idx" ON "HookPackage"("projectId", "businessGoal");

-- CreateIndex
CREATE UNIQUE INDEX "PublishJob_idempotencyKey_key" ON "PublishJob"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PublishJob_workspaceId_brandId_status_scheduledFor_idx" ON "PublishJob"("workspaceId", "brandId", "status", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedPost_publishJobId_key" ON "PublishedPost"("publishJobId");

-- CreateIndex
CREATE INDEX "PublishedPost_workspaceId_brandId_publishedAt_idx" ON "PublishedPost"("workspaceId", "brandId", "publishedAt");

-- CreateIndex
CREATE INDEX "PublishedPost_remotePostId_idx" ON "PublishedPost"("remotePostId");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_workspaceId_brandId_capturedAt_idx" ON "AnalyticsSnapshot"("workspaceId", "brandId", "capturedAt");

-- CreateIndex
CREATE INDEX "ExperimentRun_workspaceId_brandId_status_idx" ON "ExperimentRun"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalRequest_reviewLinkToken_key" ON "ApprovalRequest"("reviewLinkToken");

-- CreateIndex
CREATE INDEX "ApprovalRequest_workspaceId_brandId_status_idx" ON "ApprovalRequest"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE INDEX "EngagementThread_workspaceId_brandId_status_idx" ON "EngagementThread"("workspaceId", "brandId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EngagementThread_channel_platformThreadId_key" ON "EngagementThread"("channel", "platformThreadId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentEvent_socialCommentId_key" ON "CommentEvent"("socialCommentId");

-- CreateIndex
CREATE INDEX "CommentEvent_threadId_moderationDecision_idx" ON "CommentEvent"("threadId", "moderationDecision");

-- CreateIndex
CREATE UNIQUE INDEX "DmEvent_socialDmId_key" ON "DmEvent"("socialDmId");

-- CreateIndex
CREATE INDEX "DmEvent_threadId_moderationDecision_idx" ON "DmEvent"("threadId", "moderationDecision");

-- CreateIndex
CREATE INDEX "NotificationEvent_userId_status_channel_idx" ON "NotificationEvent"("userId", "status", "channel");

-- CreateIndex
CREATE INDEX "NotificationEvent_workspaceId_brandId_eventType_idx" ON "NotificationEvent"("workspaceId", "brandId", "eventType");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_workspaceId_status_idx" ON "Subscription"("workspaceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UsageCounter_workspaceId_metric_periodStart_key" ON "UsageCounter"("workspaceId", "metric", "periodStart");

-- CreateIndex
CREATE INDEX "AuditLog_workspaceId_brandId_createdAt_idx" ON "AuditLog"("workspaceId", "brandId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthMemory_brandId_key" ON "GrowthMemory"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "BackgroundJob_externalJobId_key" ON "BackgroundJob"("externalJobId");

-- CreateIndex
CREATE UNIQUE INDEX "BackgroundJob_idempotencyKey_key" ON "BackgroundJob"("idempotencyKey");

-- CreateIndex
CREATE INDEX "BackgroundJob_queueName_status_createdAt_idx" ON "BackgroundJob"("queueName", "status", "createdAt");

-- CreateIndex
CREATE INDEX "BackgroundJob_workspaceId_brandId_projectId_idx" ON "BackgroundJob"("workspaceId", "brandId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_workspaceId_key_key" ON "FeatureFlag"("workspaceId", "key");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordCredential" ADD CONSTRAINT "PasswordCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceInvitation" ADD CONSTRAINT "WorkspaceInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandDnaProfile" ADD CONSTRAINT "BrandDnaProfile_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedSocialAccount" ADD CONSTRAINT "ConnectedSocialAccount_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedSocialAccount" ADD CONSTRAINT "ConnectedSocialAccount_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_proxyAssetId_fkey" FOREIGN KEY ("proxyAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_thumbnailAssetId_fkey" FOREIGN KEY ("thumbnailAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_waveformAssetId_fkey" FOREIGN KEY ("waveformAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_mediaFileId_fkey" FOREIGN KEY ("mediaFileId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentDiagnosis" ADD CONSTRAINT "ContentDiagnosis_mediaFileId_fkey" FOREIGN KEY ("mediaFileId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_sourceDiagnosisId_fkey" FOREIGN KEY ("sourceDiagnosisId") REFERENCES "ContentDiagnosis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireResponse" ADD CONSTRAINT "QuestionnaireResponse_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_sourceMediaId_fkey" FOREIGN KEY ("sourceMediaId") REFERENCES "MediaFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "ContentDiagnosis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "QuestionnaireResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersion" ADD CONSTRAINT "ProjectVersion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersion" ADD CONSTRAINT "ProjectVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectVersion" ADD CONSTRAINT "ProjectVersion_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditOperation" ADD CONSTRAINT "EditOperation_projectVersionId_fkey" FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedVariant" ADD CONSTRAINT "GeneratedVariant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedVariant" ADD CONSTRAINT "GeneratedVariant_projectVersionId_fkey" FOREIGN KEY ("projectVersionId") REFERENCES "ProjectVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedVariant" ADD CONSTRAINT "GeneratedVariant_renderAssetId_fkey" FOREIGN KEY ("renderAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedVariant" ADD CONSTRAINT "GeneratedVariant_coverAssetId_fkey" FOREIGN KEY ("coverAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedVariant" ADD CONSTRAINT "GeneratedVariant_renderJobId_fkey" FOREIGN KEY ("renderJobId") REFERENCES "BackgroundJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptionPackage" ADD CONSTRAINT "CaptionPackage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptionPackage" ADD CONSTRAINT "CaptionPackage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HookPackage" ADD CONSTRAINT "HookPackage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HookPackage" ADD CONSTRAINT "HookPackage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishJob" ADD CONSTRAINT "PublishJob_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPost" ADD CONSTRAINT "PublishedPost_publishJobId_fkey" FOREIGN KEY ("publishJobId") REFERENCES "PublishJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPost" ADD CONSTRAINT "PublishedPost_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPost" ADD CONSTRAINT "PublishedPost_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPost" ADD CONSTRAINT "PublishedPost_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPost" ADD CONSTRAINT "PublishedPost_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "ConnectedSocialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_publishedPostId_fkey" FOREIGN KEY ("publishedPostId") REFERENCES "PublishedPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentRun" ADD CONSTRAINT "ExperimentRun_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentRun" ADD CONSTRAINT "ExperimentRun_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentRun" ADD CONSTRAINT "ExperimentRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentRun" ADD CONSTRAINT "ExperimentRun_baselineVariantId_fkey" FOREIGN KEY ("baselineVariantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentRun" ADD CONSTRAINT "ExperimentRun_winnerVariantId_fkey" FOREIGN KEY ("winnerVariantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "GeneratedVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_lockedVersionId_fkey" FOREIGN KEY ("lockedVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalComment" ADD CONSTRAINT "ApprovalComment_approvalRequestId_fkey" FOREIGN KEY ("approvalRequestId") REFERENCES "ApprovalRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalComment" ADD CONSTRAINT "ApprovalComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementThread" ADD CONSTRAINT "EngagementThread_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementThread" ADD CONSTRAINT "EngagementThread_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementThread" ADD CONSTRAINT "EngagementThread_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "ConnectedSocialAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementThread" ADD CONSTRAINT "EngagementThread_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentEvent" ADD CONSTRAINT "CommentEvent_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "EngagementThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DmEvent" ADD CONSTRAINT "DmEvent_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "EngagementThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageCounter" ADD CONSTRAINT "UsageCounter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthMemory" ADD CONSTRAINT "GrowthMemory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReply" ADD CONSTRAINT "SavedReply_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReply" ADD CONSTRAINT "SavedReply_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedReply" ADD CONSTRAINT "SavedReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureFlag" ADD CONSTRAINT "FeatureFlag_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

