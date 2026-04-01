import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildSeedBundle } from "@/modules/seed-engine";

export async function seedDatabase() {
  const seedBundle = buildSeedBundle();

  await prisma.alertRule.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.sectorImpact.deleteMany();
  await prisma.marketImpact.deleteMany();
  await prisma.pathPrediction.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.event.deleteMany();
  await prisma.eventCluster.deleteMany();
  await prisma.modelConfig.deleteMany();
  await prisma.sourceConfig.deleteMany();
  await prisma.userPreference.deleteMany();

  for (const cluster of seedBundle.eventBundles.map((item) => item.cluster)) {
    await prisma.eventCluster.create({
      data: {
        ...cluster,
        tags: cluster.tags as Prisma.InputJsonValue
      }
    });
  }

  for (const bundle of seedBundle.eventBundles) {
    await prisma.event.create({
      data: {
        ...bundle.event,
        regions: bundle.event.regions as Prisma.InputJsonValue,
        tags: bundle.event.tags as Prisma.InputJsonValue,
        actorNames: bundle.event.actorNames as Prisma.InputJsonValue,
        driverSummary: bundle.event.driverSummary as Prisma.InputJsonValue,
        constraintSummary: bundle.event.constraintSummary as Prisma.InputJsonValue,
        triggerSummary: bundle.event.triggerSummary as Prisma.InputJsonValue,
        causalChain: bundle.event.causalChain as Prisma.InputJsonValue,
        motherModel: bundle.event.motherModel as Prisma.InputJsonValue,
        marketTransmission: bundle.event.marketTransmission as Prisma.InputJsonValue,
        explanation: bundle.event.explanation as Prisma.InputJsonValue
      }
    });

    for (const actor of bundle.actors) {
      await prisma.actor.create({
        data: {
          id: `${bundle.event.id}-${actor.name}`,
          eventId: bundle.event.id,
          ...actor
        }
      });
    }

    for (const signal of bundle.signals) {
      await prisma.signal.create({
        data: {
          ...signal,
          eventId: bundle.event.id,
          rawPayload: signal.rawPayload as Prisma.InputJsonValue
        }
      });
    }

    for (const prediction of bundle.predictions) {
      await prisma.pathPrediction.create({
        data: {
          id: `${bundle.event.id}-${prediction.horizon}-${prediction.pathRank}`,
          eventId: bundle.event.id,
          horizon: prediction.horizon,
          pathName: prediction.pathName,
          probability: prediction.probability,
          keyDrivers: prediction.keyDrivers as Prisma.InputJsonValue,
          keyConstraints: prediction.keyConstraints as Prisma.InputJsonValue,
          invalidationSignals: prediction.invalidationSignals as Prisma.InputJsonValue,
          expectedMarketEffect: prediction.expectedMarketEffect,
          explanation: prediction.explanation,
          conditions: prediction.conditions as Prisma.InputJsonValue,
          pathRank: prediction.pathRank
        }
      });
    }

    for (const impact of bundle.impacts) {
      await prisma.marketImpact.create({
        data: {
          id: `${bundle.event.id}-${impact.market}-${impact.orderRank}-${impact.sectorName}`,
          eventId: bundle.event.id,
          ...impact
        }
      });
    }

    for (const sector of bundle.sectors) {
      await prisma.sectorImpact.create({
        data: {
          id: `${bundle.event.id}-${sector.market}-${sector.sectorName}`,
          eventId: bundle.event.id,
          ...sector
        }
      });
    }

    if (!bundle.backtest) {
      throw new Error(`Seed bundle ${bundle.event.id} 缺少回测对象。`);
    }

    await prisma.backtestRun.create({
      data: {
        id: `${bundle.event.id}-backtest`,
        eventId: bundle.event.id,
        modelVersion: bundle.backtest.modelVersion,
        replayWindow: bundle.backtest.replayWindow,
        timeline: bundle.backtest.timeline as Prisma.InputJsonValue,
        predictionSnapshot: bundle.backtest.predictionSnapshot as Prisma.InputJsonValue,
        actualOutcome: bundle.backtest.actualOutcome as Prisma.InputJsonValue,
        marketOutcome: bundle.backtest.marketOutcome as Prisma.InputJsonValue,
        predictionHitRate: bundle.backtest.predictionHitRate,
        marketFitScore: bundle.backtest.marketFitScore,
        errorAnalysis: bundle.backtest.errorAnalysis as Prisma.InputJsonValue,
        summary: bundle.backtest.summary
      }
    });
  }

  for (const config of seedBundle.modelConfigs) {
    await prisma.modelConfig.create({
      data: {
        ...config,
        weights: config.weights as Prisma.InputJsonValue,
        variables: config.variables as Prisma.InputJsonValue,
        mappingMatrix: config.mappingMatrix as Prisma.InputJsonValue,
        pathTemplates: config.pathTemplates as Prisma.InputJsonValue,
        sourceRules: config.sourceRules as Prisma.InputJsonValue,
        thresholds: config.thresholds as Prisma.InputJsonValue,
        visualFocus: config.visualFocus as Prisma.InputJsonValue
      }
    });
  }

  for (const sourceConfig of seedBundle.sourceConfigs) {
    await prisma.sourceConfig.create({
      data: {
        ...sourceConfig,
        ruleConfig: sourceConfig.ruleConfig as Prisma.InputJsonValue
      }
    });
  }

  for (const alertRule of seedBundle.alertRules) {
    await prisma.alertRule.create({
      data: {
        ...alertRule,
        condition: alertRule.condition as Prisma.InputJsonValue
      }
    });
  }

  await prisma.userPreference.create({
    data: {
      ...seedBundle.userPreference,
      theme: seedBundle.userPreference.theme as "LIGHT" | "DARK" | "SYSTEM",
      preferredMarkets: seedBundle.userPreference.preferredMarkets as Prisma.InputJsonValue,
      savedFilters: seedBundle.userPreference.savedFilters as Prisma.InputJsonValue,
      value: seedBundle.userPreference.value as Prisma.InputJsonValue
    }
  });

  return {
    events: seedBundle.eventBundles.length,
    models: seedBundle.modelConfigs.length,
    sources: seedBundle.sourceConfigs.length
  };
}

export async function ensureDatabaseSeeded() {
  const eventCount = await prisma.event.count().catch(() => 0);
  if (eventCount > 0) {
    return false;
  }

  await seedDatabase();
  return true;
}
