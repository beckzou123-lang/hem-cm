import type {
  AssetClass,
  EventStage,
  FamilyType,
  Horizon,
  ImpactDirection,
  MarketCode,
  SourceGrade,
  SourceType
} from "@prisma/client";

export type FamilyConfig = {
  familyType: FamilyType;
  label: string;
  variables: string[];
  weights: Record<string, number>;
  stageBias: Partial<Record<EventStage, number>>;
  pathTemplates: {
    name: string;
    driverBias: number;
    constraintBias: number;
    narration: string;
  }[];
  marketFocus: string[];
  visualFocus: string[];
};

export type RawSignalInput = {
  id: string;
  headline: string;
  summary: string;
  signalType: "NEWS" | "OFFICIAL" | "SPEECH" | "ANOMALY" | "MARKET" | "PHYSICAL";
  sourceType: SourceType;
  sourceGrade: SourceGrade;
  sourceName: string;
  publishTime: string;
  rawPayload: Record<string, unknown>;
};

export type RawActorInput = {
  name: string;
  actorType: string;
  region: string;
  role: string;
  objective: string;
  leverageScore: number;
  stance: string;
  description: string;
};

export type RawEventSample = {
  id: string;
  clusterId: string;
  title: string;
  baseTitle: string;
  shortTitle: string;
  summary: string;
  narrative: string;
  familyHints: string[];
  subTypeHints: string[];
  tags: string[];
  regions: string[];
  actors: RawActorInput[];
  sourceInputs: RawSignalInput[];
  startTime: string;
  latestUpdateTime: string;
  severityBase: number;
  confidenceBase: number;
  actualOutcome: {
    headline: string;
    outcomePath: string;
    marketOutcome: string;
    realizedEffects: string[];
  };
  keyDrivers: string[];
  keyConstraints: string[];
  keyTriggers: string[];
  diffusionPaths: string[];
  marketTransmission: string[];
};

export type MotherModel = {
  actors: string[];
  actorGoals: string[];
  incentiveIntensity: number;
  constraintIntensity: number;
  triggerConditions: string[];
  opponentResponseElasticity: number;
  diffusionPaths: string[];
  marketTransmissionMediators: string[];
};

export type CausalNode = {
  id: string;
  title: string;
  kind:
    | "driver"
    | "actor"
    | "incentive"
    | "constraint"
    | "trigger"
    | "response"
    | "diffusion"
    | "market";
  score: number;
  detail: string;
  evidence: string[];
};

export type CausalEdge = {
  source: string;
  target: string;
  strength: number;
  explanation: string;
};

export type CausalChain = {
  nodes: CausalNode[];
  edges: CausalEdge[];
};

export type PathOutput = {
  horizon: Horizon;
  pathName: string;
  probability: number;
  keyDrivers: string[];
  keyConstraints: string[];
  invalidationSignals: string[];
  expectedMarketEffect: string;
  explanation: string;
  conditions: string[];
  pathRank: number;
};

export type ImpactOutput = {
  market: MarketCode;
  assetClass: AssetClass;
  sectorName: string;
  direction: ImpactDirection;
  strengthScore: number;
  pricedInScore: number;
  crowdingScore: number;
  phaseTag: string;
  summary: string;
  explanation: string;
  orderRank: number;
};

export type SectorOutput = {
  market: MarketCode;
  sectorName: string;
  direction: ImpactDirection;
  score: number;
  confidenceScore: number;
  explanation: string;
  benchmarkImpact: number;
};

export type SignalAggregate = {
  confirmationCount: number;
  averageConfidence: number;
  topGrade: SourceGrade;
  noisePenalty: number;
  entersModel: boolean;
  priorityScore: number;
};
