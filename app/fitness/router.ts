import { FITNESS_MODULE_MAP, FITNESS_MODULES } from "./modules";
import type { FitnessKnowledgeModule } from "./types";

const OFF_TOPIC_KEYWORDS = [
  "股票",
  "基金",
  "编程",
  "代码",
  "论文",
  "经济学",
  "写作",
  "历史",
  "政治",
] as const;

const FITNESS_KEYWORDS = [
  "训练",
  "健身",
  "动作",
  "肌肉",
  "肩",
  "胸",
  "背",
  "腿",
  "臀",
  "腹",
  "手臂",
  "饮食",
  "恢复",
  "补剂",
  "体态",
] as const;

export function routeFitnessKnowledge(query: string): FitnessKnowledgeModule[] {
  const normalized = query.trim().toLowerCase();
  const scored = FITNESS_MODULES.map((module) => ({
    module,
    score: module.keywords.reduce(
      (total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    ),
  }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length === 0) {
    return [];
  }

  const primary = scored[0].module;
  if (!primary.dependsOn) {
    return [primary];
  }

  const dependency = FITNESS_MODULE_MAP.get(primary.dependsOn);
  return dependency ? [dependency, primary] : [primary];
}

export function isLikelyOffTopic(query: string): boolean {
  const normalized = query.trim().toLowerCase();
  const hasFitnessSignal = FITNESS_KEYWORDS.some((keyword) => normalized.includes(keyword));
  const hasOffTopicSignal = OFF_TOPIC_KEYWORDS.some((keyword) => normalized.includes(keyword));
  return hasOffTopicSignal && !hasFitnessSignal;
}

export function getImmediateSafetyReply(query: string): string | null {
  const normalized = query.replace(/\s+/g, "");
  const redFlagPatterns = [
    /急性(受伤|损伤)/,
    /突然受伤/,
    /明显肿胀/,
    /(疼痛|不适).*(持续加重|越来越重|越来越痛)/,
    /(持续加重|越来越重|越来越痛).*(疼痛|不适)/,
    /胸痛/,
    /晕厥|晕倒|失去知觉/,
    /麻木.*无力|无力.*麻木/,
  ];

  if (!redFlagPatterns.some((pattern) => pattern.test(normalized))) {
    return null;
  }

  return "你描述的情况已经超出普通训练调整范围。先停止会诱发症状的训练，不要通过降重、拉伸或热身继续试。请尽快找运动医学、骨科、康复医学或其他合格医疗专业人员评估；如果伴随胸痛、晕厥、呼吸困难或突然明显无力，请及时寻求紧急医疗帮助。";
}
