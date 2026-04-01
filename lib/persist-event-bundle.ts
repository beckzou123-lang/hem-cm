import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type EventBundle = ReturnType<typeof import("@/modules/event-engine").buildEventBundle>;

export async function persistEventBundle(bundle: EventBundle) {
  await prisma.$transaction(async (tx) => {
    await tx.eventCluster.upsert({
      where: { id: bundle.cluster.id },
      update: {
        title: bundle.cluster.title,
        familyType: bundle.cluster.familyType,
        summary: bundle.cluster.summary,
        confidenceScore: bundle.cluster.confidenceScore,
        severityScore: bundle.cluster.severityScore,
        tags: bundle.cluster.tags as Prisma.InputJsonValue
      },
      create: {
        ...bundle.cluster,
        tags: bundle.cluster.tags as Prisma.InputJsonValue
      }
    });

    await tx.event.upsert({
      where: { id: bundle.event.id },
      update: {
        clusterId: bundle.event.clusterId,
        title: bundle.event.title,
        familyType: bundle.event.familyType,
        subType: bundle.event.subType,
        currentStage: bundle.event.currentStage,
        severityScore: bundle.event.severityScore,
        confidenceScore: bundle.event.confidenceScore,
        summary: bundle.event.summary,
        regions: bundle.event.regions as Prisma.InputJsonValue,
        tags: bundle.event.tags as Prisma.InputJsonValue,
        startTime: new Date(bundle.event.startTime),
        latestUpdateTime: new Date(bundle.event.latestUpdateTime),
        sourceCount: bundle.event.sourceCount,
        status: bundle.event.status,
        stageExplanation: bundle.event.stageExplanation,
        actorNames: bundle.event.actorNames as Prisma.InputJsonValue,
        driverSummary: bundle.event.driverSummary as Prisma.InputJsonValue,
        constraintSummary: bundle.event.constraintSummary as Prisma.InputJsonValue,
        triggerSummary: bundle.event.triggerSummary as Prisma.InputJsonValue,
        causalChain: bundle.event.causalChain as Prisma.InputJsonValue,
        motherModel: bundle.event.motherModel as Prisma.InputJsonValue,
        marketTransmission: bundle.event.marketTransmission as Prisma.InputJsonValue,
        explanation: bundle.event.explanation as Prisma.InputJsonValue
      },
      create: {
        ...bundle.event,
        regions: bundle.event.regions as Prisma.InputJsonValue,
        tags: bundle.event.tags as Prisma.InputJsonValue,
        startTime: new Date(bundle.event.startTime),
        latestUpdateTime: new Date(bundle.event.latestUpdateTime),
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

    await tx.actor.deleteMany({ where: { eventId: bundle.event.id } });
    await tx.signal.deleteMany({ where: { eventId: bundle.event.id } });
    await tx.pathPrediction.deleteMany({ where: { eventId: bundle.event.id } });
    await tx.marketImpact.deleteMany({ where: { eventId: bundle.event.id } });
    await tx.sectorImpact.deleteMany({ where: { eventId: bundle.event.id } });
    await tx.backtestRun.deleteMany({ where: { eventId: bundle.event.id } });

    for (const actor of bundle.actors) {
      await tx.actor.create({
        data: {
          id: `${bundle.event.id}-${actor.name}`,
          eventId: bundle.event.id,
          ...actor
        }
      });
    }

    for (const signal of bundle.signals) {
      await tx.signal.create({
        data: {
          ...signal,
          eventId: bundle.event.id,
          publishTime: new Date(signal.publishTime),
          rawPayload: signal.rawPayload as Prisma.InputJsonValue
        }
      });
    }

    for (const prediction of bundle.predictions) {
      await tx.pathPrediction.create({
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
      await tx.marketImpact.create({
        data: {
          id: `${bundle.event.id}-${impact.market}-${impact.orderRank}-${impact.sectorName}`,
          eventId: bundle.event.id,
          ...impact
        }
      });
    }

    for (const sector of bundle.sectors) {
      await tx.sectorImpact.create({
        data: {
          id: `${bundle.event.id}-${sector.market}-${sector.sectorName}`,
          eventId: bundle.event.id,
          ...sector
        }
      });
    }

    if (bundle.backtest) {
      await tx.backtestRun.create({
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
  });

  return bundle.event.id;
}
