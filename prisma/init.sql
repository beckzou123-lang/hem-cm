CREATE TABLE "EventCluster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "familyType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "severityScore" REAL NOT NULL,
    "tags" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clusterId" TEXT,
    "title" TEXT NOT NULL,
    "familyType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "severityScore" REAL NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "summary" TEXT NOT NULL,
    "regions" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "startTime" DATETIME NOT NULL,
    "latestUpdateTime" DATETIME NOT NULL,
    "sourceCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "stageExplanation" TEXT NOT NULL,
    "actorNames" JSONB NOT NULL,
    "driverSummary" JSONB NOT NULL,
    "constraintSummary" JSONB NOT NULL,
    "triggerSummary" JSONB NOT NULL,
    "causalChain" JSONB NOT NULL,
    "motherModel" JSONB NOT NULL,
    "marketTransmission" JSONB NOT NULL,
    "explanation" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "EventCluster" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Actor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "leverageScore" REAL NOT NULL,
    "stance" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Actor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceGrade" TEXT NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "publishTime" DATETIME NOT NULL,
    "decayWeight" REAL NOT NULL,
    "validatedFlag" BOOLEAN NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "mergedKey" TEXT NOT NULL,
    "entersModel" BOOLEAN NOT NULL,
    "priorityScore" REAL NOT NULL,
    CONSTRAINT "Signal_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PathPrediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "pathName" TEXT NOT NULL,
    "probability" REAL NOT NULL,
    "keyDrivers" JSONB NOT NULL,
    "keyConstraints" JSONB NOT NULL,
    "invalidationSignals" JSONB NOT NULL,
    "expectedMarketEffect" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "pathRank" INTEGER NOT NULL,
    CONSTRAINT "PathPrediction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MarketImpact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "sectorName" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "strengthScore" REAL NOT NULL,
    "pricedInScore" REAL NOT NULL,
    "crowdingScore" REAL NOT NULL,
    "phaseTag" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "orderRank" INTEGER NOT NULL,
    CONSTRAINT "MarketImpact_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "SectorImpact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "sectorName" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "confidenceScore" REAL NOT NULL,
    "explanation" TEXT NOT NULL,
    "benchmarkImpact" REAL NOT NULL,
    CONSTRAINT "SectorImpact_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BacktestRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "replayWindow" TEXT NOT NULL,
    "timeline" JSONB NOT NULL,
    "predictionSnapshot" JSONB NOT NULL,
    "actualOutcome" JSONB NOT NULL,
    "marketOutcome" JSONB NOT NULL,
    "predictionHitRate" REAL NOT NULL,
    "marketFitScore" REAL NOT NULL,
    "errorAnalysis" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    CONSTRAINT "BacktestRun_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ModelConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyType" TEXT,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weights" JSONB NOT NULL,
    "variables" JSONB NOT NULL,
    "mappingMatrix" JSONB NOT NULL,
    "pathTemplates" JSONB NOT NULL,
    "sourceRules" JSONB NOT NULL,
    "thresholds" JSONB NOT NULL,
    "visualFocus" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "SourceConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceGrade" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "refreshCron" TEXT NOT NULL,
    "latencyHint" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "ruleConfig" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AlertRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AlertRule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "refreshMinutes" INTEGER NOT NULL,
    "preferredMarkets" JSONB NOT NULL,
    "demoMode" BOOLEAN NOT NULL,
    "savedFilters" JSONB NOT NULL,
    "exportFormat" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "UserPreference_key_key" ON "UserPreference"("key");
