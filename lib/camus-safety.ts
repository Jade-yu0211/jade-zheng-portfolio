const SELF_HARM_PATTERNS = [
  /我(?:现在|马上|今晚|今天|待会儿?|已经|刚刚|准备|打算|决定|真的|就要|想要?|要).{0,12}(?:自杀|轻生|结束生命|伤害自己|杀死自己|割腕|跳楼|跳河|吞药|服药过量)/,
  /我.{0,6}(?:不想活了|活不下去了|想死|想结束这一切)/,
  /(?:我)?(?:已经|刚刚).{0,10}(?:割腕|吞药|吃了很多药|服药过量|跳楼|伤害自己)/,
] as const;

const VIOLENCE_PATTERNS = [
  /我(?:现在|马上|今晚|今天|待会儿?|已经|刚刚|准备|打算|决定|就要|要).{0,12}(?:杀死?|杀了|捅|砍|打死|伤害).{0,12}(?:他|她|他们|她们|那个人|某个人|同学|老师|家人|老板|邻居)/,
  /我.{0,8}(?:拿着|准备了|带着).{0,8}(?:刀|枪|武器).{0,10}(?:去找|找|伤害|杀)/,
] as const;

const SELF_HARM_REPLY =
  "我先暂停哲学讨论。你现在的安全最重要。如果你已经采取行动、准备马上行动，或手边有药物、刀具等手段，请立即联系当地紧急服务或直接前往最近的急诊；在安全可行时，把相关物品移远，并立刻联系一位可信任的人来陪你，不要独处。请告诉我：你是否已经采取行动、是否准备马上行动、现在是否独处，以及你所在的国家或地区。";

const VIOLENCE_REPLY =
  "我先暂停哲学讨论。请先不要接近对方，也不要采取行动；在安全可行时放下并远离武器或其他危险物品，离开冲突现场，联系当地紧急服务或一位可信任的人陪着你。如果危险正在发生，请立即呼叫当地紧急服务。请告诉我：你是否正准备马上行动、是否能接触危险物品、现在是否与对方在一起，以及你所在的国家或地区。";

export function getImmediateCamusSafetyReply(query: string): string | null {
  const normalized = query.normalize("NFKC").replace(/\s+/g, "");

  if (SELF_HARM_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return SELF_HARM_REPLY;
  }

  if (VIOLENCE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return VIOLENCE_REPLY;
  }

  return null;
}
