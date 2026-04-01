import { clamp, formatScore } from "@/lib/utils";
import type { CausalChain, MotherModel, RawEventSample } from "@/lib/types";

export function buildMotherModel(sample: RawEventSample) {
  const incentiveIntensity = formatScore(clamp(sample.keyDrivers.length * 12 + sample.severityBase * 0.42));
  const constraintIntensity = formatScore(clamp(sample.keyConstraints.length * 14 + (100 - sample.severityBase) * 0.18));
  const opponentResponseElasticity = formatScore(clamp(sample.actors.slice(0, 2).reduce((sum, actor) => sum + actor.leverageScore, 0) / 2));

  const motherModel: MotherModel = {
    actors: sample.actors.map((actor) => actor.name),
    actorGoals: sample.actors.map((actor) => `${actor.name}：${actor.objective}`),
    incentiveIntensity,
    constraintIntensity,
    triggerConditions: sample.keyTriggers,
    opponentResponseElasticity,
    diffusionPaths: sample.diffusionPaths,
    marketTransmissionMediators: sample.marketTransmission
  };

  return motherModel;
}

export function buildCausalChain(sample: RawEventSample, motherModel: MotherModel): CausalChain {
  const driverNodes = sample.keyDrivers.slice(0, 2).map((driver, index) => ({
    id: `driver-${index}`,
    title: driver,
    kind: "driver" as const,
    score: formatScore(clamp(motherModel.incentiveIntensity - index * 4)),
    detail: `驱动因子来自 ${sample.familyHints.join("、")} 的主矛盾推进。`,
    evidence: sample.sourceInputs.slice(index, index + 2).map((signal) => signal.headline)
  }));

  const actorNode = {
    id: "actor-core",
    title: sample.actors.slice(0, 3).map((actor) => actor.name).join(" / "),
    kind: "actor" as const,
    score: formatScore(clamp(sample.actors.reduce((sum, actor) => sum + actor.leverageScore, 0) / sample.actors.length)),
    detail: "核心行为体既提供推动力，也决定冲突或政策的边界条件。",
    evidence: sample.actors.slice(0, 3).map((actor) => `${actor.name}：${actor.objective}`)
  };

  const incentiveNode = {
    id: "incentive-main",
    title: "激励与目标",
    kind: "incentive" as const,
    score: motherModel.incentiveIntensity,
    detail: sample.narrative,
    evidence: motherModel.actorGoals
  };

  const constraintNode = {
    id: "constraint-main",
    title: "约束与边界",
    kind: "constraint" as const,
    score: motherModel.constraintIntensity,
    detail: "约束来自盟友成本、经济承压、监管/舆论压力与执行资源上限。",
    evidence: sample.keyConstraints
  };

  const triggerNode = {
    id: "trigger-main",
    title: sample.keyTriggers[0] ?? "关键触发",
    kind: "trigger" as const,
    score: formatScore(clamp(sample.severityBase * 0.92)),
    detail: "触发器决定事件从情绪定价走向基本面映射。",
    evidence: sample.keyTriggers
  };

  const responseNode = {
    id: "response-main",
    title: "对手响应",
    kind: "response" as const,
    score: motherModel.opponentResponseElasticity,
    detail: "对手响应弹性越高，越容易把单点冲击放大为多轮互动。",
    evidence: sample.actors.slice(1).map((actor) => `${actor.name} 的姿态：${actor.stance}`)
  };

  const diffusionNode = {
    id: "diffusion-main",
    title: "扩散路径",
    kind: "diffusion" as const,
    score: formatScore(clamp(sample.diffusionPaths.length * 17)),
    detail: "扩散路径描述事件如何从局部矛盾传导至社会、行业与跨市场。",
    evidence: sample.diffusionPaths
  };

  const marketNode = {
    id: "market-main",
    title: "市场传导链",
    kind: "market" as const,
    score: formatScore(clamp(sample.marketTransmission.length * 15)),
    detail: "映射链路帮助用户判断影响方向、强度与是否已被定价。",
    evidence: sample.marketTransmission
  };

  const nodes = [...driverNodes, actorNode, incentiveNode, constraintNode, triggerNode, responseNode, diffusionNode, marketNode];
  const edges = [
    { source: driverNodes[0]?.id ?? "driver-0", target: actorNode.id, strength: 84, explanation: "驱动因素定义核心行为体的行动边界。" },
    { source: actorNode.id, target: incentiveNode.id, strength: 82, explanation: "行为体目标决定行动强度与节奏。" },
    { source: incentiveNode.id, target: triggerNode.id, strength: 78, explanation: "激励积累到阈值后触发显性事件。" },
    { source: constraintNode.id, target: triggerNode.id, strength: 65, explanation: "约束决定触发是否可持续。" },
    { source: triggerNode.id, target: responseNode.id, strength: 88, explanation: "关键触发迫使对手表态或反制。" },
    { source: responseNode.id, target: diffusionNode.id, strength: 80, explanation: "对手响应决定事件是否外溢。" },
    { source: diffusionNode.id, target: marketNode.id, strength: 86, explanation: "扩散路径将风险转化为市场冲击。" }
  ];

  return { nodes, edges };
}
