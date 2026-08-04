import knowledgeData from "./knowledge.json";
import type { KnowledgeCard, RetrievalResult } from "../persona/types";

const KNOWLEDGE = knowledgeData as unknown as KnowledgeCard[];
const CARD_BY_ID = new Map(KNOWLEDGE.map((card) => [card.id, card]));
const CORE_ID_PATTERN = /^adler-0(?:0[1-9]|1[0-8])$/;
const SEARCHABLE_CARDS = KNOWLEDGE.map((card) =>
  `${card.title} ${card.tags.join(" ")} ${card.content}`.toLowerCase(),
);
const DOCUMENT_FREQUENCY_CACHE = new Map<string, number>();

const STOP_TERMS = new Set([
  "阿德勒",
  "怎么看",
  "怎么做",
  "怎么办",
  "是什么",
  "为什么",
  "是不是",
  "一定是",
  "请问",
  "一个",
  "这个",
  "那个",
  "我们",
  "他们",
  "自己",
  "真的",
  "总是",
]);

const INTENT_TERMS: Record<string, string[]> = {
  procrastination: [
    "拖延",
    "不敢开始",
    "卡住",
    "怕做不好",
    "完美主义",
    "临近截止才做",
    "准备不足",
    "回避",
    "失败",
    "安全网",
    "气馁",
  ],
  classroom: [
    "孩子",
    "学生",
    "上课",
    "插话",
    "离座",
    "捣乱",
    "不听话",
    "作业",
    "老师",
    "家长",
    "同学",
    "课堂",
    "纪律",
    "合作",
    "关注",
  ],
  control: [
    "查手机",
    "定位",
    "监视",
    "替我决定",
    "不许",
    "限制",
    "报复",
    "威胁",
    "隔离",
    "经济控制",
    "性强迫",
    "控制欲",
    "权力",
    "优越",
    "关系合作",
  ],
  dream: ["做梦", "梦见", "梦", "梦境", "目的假设"],
  birthOrder: [
    "出生顺序",
    "家庭排行",
    "排行",
    "老大",
    "老二",
    "老幺",
    "家庭位置",
    "非决定论",
  ],
  earlyMemory: ["早期记忆", "童年记忆", "最早记忆"],
  inferiority: ["自卑", "补偿", "追求卓越", "比我优秀", "不如别人"],
  social: ["社会兴趣", "社会情感", "共同体", "共同生活", "合作", "现实检验"],
  purpose: ["目的论", "行为目的", "目标导向", "暂定目标", "目的假设"],
  lifestyle: ["生活方式", "人格整体", "主观意义", "统一方向"],
};

const INTENT_TRIGGERS: Record<string, string[]> = {
  control: [
    "查手机",
    "定位",
    "监视",
    "替我决定",
    "不许",
    "限制",
    "报复",
    "威胁",
    "隔离",
    "经济控制",
    "性强迫",
    "控制欲",
  ],
  classroom: [
    "孩子",
    "学生",
    "上课",
    "插话",
    "离座",
    "捣乱",
    "不听话",
    "作业",
    "老师",
    "家长",
    "同学",
    "课堂",
  ],
  procrastination: [
    "拖延",
    "不敢开始",
    "卡住",
    "怕做不好",
    "完美主义",
    "临近截止才做",
    "准备不足",
  ],
  dream: ["做梦", "梦见", "梦境", "梦能", "梦的"],
  birthOrder: ["出生顺序", "家庭排行", "排行", "老大", "老二", "老幺", "家庭位置"],
  earlyMemory: ["早期记忆", "童年记忆", "最早记忆"],
  inferiority: ["自卑", "补偿", "追求卓越", "比我优秀", "不如别人"],
  social: ["社会兴趣", "社会情感", "共同体", "共同生活", "合作"],
  purpose: ["目的论", "行为目的", "目标导向", "暂定目标"],
  lifestyle: ["生活方式", "人格整体", "主观意义"],
};

const FORCED_IDS: Record<string, string[]> = {
  procrastination: ["adler-023", "adler-064", "adler-078", "adler-003", "adler-010"],
  classroom: ["adler-016", "adler-094", "adler-084", "adler-096"],
  control: ["adler-041", "adler-054", "adler-011"],
  dream: ["adler-013", "adler-027", "adler-052", "adler-018"],
  birthOrder: ["adler-029", "adler-055", "adler-089", "adler-014"],
  earlyMemory: ["adler-012", "adler-025", "adler-018"],
  inferiority: ["adler-003", "adler-005", "adler-047", "adler-048", "adler-080"],
  social: ["adler-006", "adler-007", "adler-011", "adler-041"],
  purpose: ["adler-001", "adler-002", "adler-039", "adler-018"],
  lifestyle: ["adler-001", "adler-002", "adler-009", "adler-018"],
};

function stripActivationPhrases(query: string): string {
  return query
    .toLowerCase()
    .replace(/(?:阿德勒会怎么看|用阿德勒分析|从阿德勒角度|我该怎么办|请问)/g, " ");
}

function detectIntent(query: string): string {
  for (const intent of [
    "control",
    "classroom",
    "procrastination",
    "dream",
    "birthOrder",
    "earlyMemory",
    "inferiority",
    "social",
    "purpose",
    "lifestyle",
  ]) {
    if (INTENT_TRIGGERS[intent].some((term) => query.includes(term))) return intent;
  }
  return "general";
}

function documentFrequency(term: string): number {
  const cached = DOCUMENT_FREQUENCY_CACHE.get(term);
  if (cached !== undefined) return cached;
  const count = SEARCHABLE_CARDS.reduce(
    (total, haystack) => total + (haystack.includes(term) ? 1 : 0),
    0,
  );
  DOCUMENT_FREQUENCY_CACHE.set(term, count);
  return count;
}

function extractQueryTerms(query: string): string[] {
  const terms = new Set<string>();
  for (const token of query.match(/[a-z0-9][a-z0-9-]{1,}/g) ?? []) terms.add(token);

  for (const rawSegment of (query.match(/[\p{Script=Han}]{2,}/gu) ?? []).slice(0, 12)) {
    const segment = rawSegment.slice(0, 96);
    if (segment.length <= 8 && !STOP_TERMS.has(segment)) terms.add(segment);
    for (let size = 2; size <= 4; size += 1) {
      for (let index = 0; index <= segment.length - size; index += 1) {
        const term = segment.slice(index, index + size);
        if (!STOP_TERMS.has(term)) terms.add(term);
        if (terms.size >= 180) break;
      }
      if (terms.size >= 180) break;
    }
    if (terms.size >= 180) break;
  }

  return [...terms].filter((term) => {
    const frequency = documentFrequency(term);
    return term.length >= 2 && frequency > 0 && frequency <= 20;
  });
}

function getExpansionTerms(intent: string, query: string): string[] {
  if (intent === "general") return [];
  const cluster = INTENT_TERMS[intent] ?? [];
  const triggerHit = cluster.some((term) => query.includes(term));
  return triggerHit ? cluster : [];
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let position = 0;
  while (count < 2) {
    const match = haystack.indexOf(needle, position);
    if (match === -1) break;
    count += 1;
    position = match + needle.length;
  }
  return count;
}

function scoreCard(
  card: KnowledgeCard,
  directTerms: string[],
  expansionTerms: string[],
): { score: number; directMatches: string[] } {
  const title = card.title.toLowerCase();
  const tags = card.tags.join(" ").toLowerCase();
  const content = card.content.toLowerCase();
  let score = 0;
  const directMatches = new Set<string>();

  for (const [term, termWeight, isDirect] of [
    ...directTerms.map((term) => [term, 10, true] as const),
    ...expansionTerms.map((term) => [term, 8, false] as const),
  ]) {
    const titleHits = countOccurrences(title, term);
    const tagHits = countOccurrences(tags, term);
    const bodyHits = countOccurrences(content, term);
    score += termWeight * (titleHits * 6 + tagHits * 4 + bodyHits);
    if (isDirect && titleHits + tagHits + bodyHits > 0) directMatches.add(term);
  }

  return { score, directMatches: [...directMatches] };
}

function getCard(id: string): KnowledgeCard {
  const card = CARD_BY_ID.get(id);
  if (!card) throw new Error(`Missing Adler knowledge card: ${id}`);
  return card;
}

export function retrieveAdlerKnowledge(query: string): RetrievalResult {
  const normalized = stripActivationPhrases(query);
  const intent = detectIntent(normalized);
  const directTerms = extractQueryTerms(normalized);
  const expansionTerms = getExpansionTerms(intent, normalized);
  const scored = KNOWLEDGE.map((card) => {
    const result = scoreCard(card, directTerms, expansionTerms);
    return { card, ...result };
  }).sort((left, right) => right.score - left.score || left.card.id.localeCompare(right.card.id));

  const candidates = scored.slice(0, 8);
  const topDirectMatchCount = candidates[0]?.directMatches.length ?? 0;
  const sufficient = intent !== "general" || topDirectMatchCount >= 2;

  if (!sufficient) {
    return {
      cards: [],
      sufficient: false,
      intent,
      matchedTerms: candidates[0]?.directMatches.slice(0, 8) ?? [],
    };
  }

  const selected: KnowledgeCard[] = [];
  const forcedIds = FORCED_IDS[intent] ?? [];
  for (const id of forcedIds) selected.push(getCard(id));

  if (forcedIds.length === 0) {
    for (const candidate of candidates) {
      if (selected.length >= 5) break;
      if (candidate.score > 0 && !selected.some((card) => card.id === candidate.card.id)) {
        selected.push(candidate.card);
      }
    }
  }

  if (intent === "general" && !selected.some((card) => CORE_ID_PATTERN.test(card.id))) {
    const relevantCore = candidates.find(
      ({ card, score }) => CORE_ID_PATTERN.test(card.id) && score > 0,
    )?.card;
    if (!relevantCore) {
      return {
        cards: [],
        sufficient: false,
        intent,
        matchedTerms: candidates[0]?.directMatches.slice(0, 8) ?? [],
      };
    }
    selected.push(relevantCore);
  }

  const uniqueCards = [...new Map(selected.map((card) => [card.id, card])).values()].slice(0, 5);
  const matchedTerms = new Set<string>();
  for (const candidate of candidates) {
    if (uniqueCards.some((card) => card.id === candidate.card.id)) {
      candidate.directMatches.forEach((term) => matchedTerms.add(term));
    }
  }

  return {
    cards: uniqueCards,
    sufficient: true,
    intent,
    matchedTerms: [...matchedTerms].slice(0, 12),
  };
}
