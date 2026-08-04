const DIRECT_SELF_HARM_PATTERN =
  /(?:我|本人).{0,12}(?:想死|不想活|活不下去|结束生命|自杀|自残|伤害自己|已经准备好去死)/;
const IMMINENT_SELF_HARM_PATTERN =
  /(?:现在|马上|今晚|今天|已经|正在|准备|打算|计划).{0,10}(?:自杀|自残|结束生命|去死|伤害自己)/;
const DIRECT_HARM_PATTERN =
  /(?:我|本人).{0,12}(?:要|想|准备|打算|计划).{0,8}(?:杀人|杀了|杀死|伤害他人|伤害别人|砍人|捅人|报复他)/;
const CONCEPTUAL_DISCUSSION_PATTERN =
  /(?:想了解|想讨论|想研究|如何看待|怎么看|作品中|哲学意义).{0,12}(?:自杀|自残|杀人|伤害)/;

const CHILD_CONTEXT_PATTERN = /(?:孩子|儿童|小孩|未成年|学生|儿子|女儿)/;
const CHILD_DANGER_PATTERN =
  /(?:性侵|猥亵|强奸|虐待|殴打|暴打|被打伤|严重忽视|不给吃饭|生命危险|即时危险)/;
const COERCIVE_CONTROL_PATTERN =
  /(?:查(?:我)?(?:手机|设备)|定位(?:我)?|跟踪|监视|监听|威胁报复|威胁我|隔离亲友|不许我出门|限制(?:金钱|就医|出行)|经济控制|性强迫|强迫性行为|害怕拒绝|不敢拒绝)/;

export function hasImmediateSelfHarmOrViolenceRisk(message: string): boolean {
  const compact = message.replace(/\s+/g, "");
  if (
    CONCEPTUAL_DISCUSSION_PATTERN.test(compact) &&
    !/(?:现在|马上|今晚|已经准备|已经实施|有具体计划)/.test(compact)
  ) {
    return false;
  }
  return (
    DIRECT_SELF_HARM_PATTERN.test(compact) ||
    IMMINENT_SELF_HARM_PATTERN.test(compact) ||
    DIRECT_HARM_PATTERN.test(compact)
  );
}

export function getCamusImmediateSafetyReply(message: string): string | null {
  if (!hasImmediateSelfHarmOrViolenceRisk(message)) return null;

  return [
    "我先不从加缪或哲学角度讨论这件事。你现在的安全最重要。",
    "如果你或他人可能马上受伤，请立即联系当地紧急服务，并尽快去有其他人在场的安全地点。先远离可能用于伤害的物品，不要独处；请马上联系一位你信任的人，直接告诉对方你现在需要陪伴和帮助。",
    "如果危险不是眼前发生，也请尽快联系当地危机支持、医院急诊或合格心理专业人员。你可以先只回复我：你或其他人现在是否处于立即危险中？",
  ].join("\n\n");
}

export function getAdlerImmediateSafetyReply(message: string): string | null {
  const compact = message.replace(/\s+/g, "");

  if (hasImmediateSelfHarmOrViolenceRisk(compact)) {
    return [
      "我先停止阿德勒式分析。你现在的安全比解释行为目的更重要。",
      "如果你或他人可能马上受伤，请立即联系当地紧急服务，并尽快去有其他人在场的安全地点。先远离可能用于伤害的物品，不要独处；请马上联系一位你信任的人，直接告诉对方你需要陪伴和帮助。",
      "如果危险不是眼前发生，也请尽快联系当地危机支持、医院急诊或合格心理专业人员。你可以先只回复我：你或其他人现在是否处于立即危险中？",
    ].join("\n\n");
  }

  if (CHILD_CONTEXT_PATTERN.test(compact) && CHILD_DANGER_PATTERN.test(compact)) {
    return [
      "这里应先处理儿童安全，不宜分析孩子或施害者的“行为目的”。",
      "若孩子正处于即时危险，请立即联系当地紧急服务，并让可信赖的成年人陪同孩子到安全地点。尽快联系当地儿童保护机构、医疗机构或学校指定的儿童安全负责人；不要让孩子独自面对或直接对质可能的施害者。",
      "请尽量保留必要事实并避免反复盘问孩子。若有受伤、性侵或急性身体风险，应优先获得专业医疗评估。",
    ].join("\n\n");
  }

  if (COERCIVE_CONTROL_PATTERN.test(compact)) {
    return [
      "你描述的情况可能涉及胁迫控制。此时不适合先分析对方是否“自卑”，也不建议在不安全时直接对质。",
      "请优先保护人身安全、隐私和退出边界：在安全设备上联系可信赖的人或当地家暴/法律援助资源，检查账号与定位共享，并准备一个可安全离开的方案。如果存在即时威胁，请联系当地紧急服务。",
      "只有在你确认安全的前提下，后续才适合讨论关系模式。",
    ].join("\n\n");
  }

  return null;
}
