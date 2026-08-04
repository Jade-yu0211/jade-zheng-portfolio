import knowledgeData from "./knowledge.json";
import type { KnowledgeCard, RetrievalResult } from "../persona/types";

const KNOWLEDGE = knowledgeData as unknown as KnowledgeCard[];
const CARD_BY_ID = new Map(KNOWLEDGE.map((card) => [card.id, card]));
const CORE_ID_PATTERN = /^camus-0(?:0[1-9]|1[0-6])$/;
const DEFAULT_CORE_IDS = ["camus-001", "camus-003", "camus-005"];

const STOP_TERMS = new Set([
  "加缪",
  "加缪说",
  "是什么",
  "为什么",
  "怎么办",
  "怎么样",
  "如何理解",
  "可以吗",
  "是不是",
  "一个",
  "这个",
  "那个",
  "我们",
  "他们",
  "没有",
  "什么",
  "为什么还",
]);

const INTENT_BOOSTS: Record<string, string[]> = {
  absurd: ["camus-001", "camus-002", "camus-021"],
  stranger: ["camus-083", "camus-085", "camus-093", "camus-007", "camus-011"],
  plague: ["camus-098", "camus-103", "camus-008", "camus-012", "camus-104"],
  limits: ["camus-003", "camus-004", "camus-005", "camus-067", "camus-064"],
};

function detectIntent(query: string): string {
  if (/(?:默尔索|局外人|葬礼|审判|检察|法庭)/.test(query)) return "stranger";
  if (/(?:里厄|鼠疫|防疫|卫生队|疫情)/.test(query)) return "plague";
  if (/(?:无辜|牺牲|谋杀|暴力|革命|平等|限度|反抗)/.test(query)) return "limits";
  if (/(?:荒诞|西西弗|终极意义|人生意义|哲学自杀)/.test(query)) return "absurd";
  return "general";
}

function extractTerms(query: string): string[] {
  const normalized = query
    .toLowerCase()
    .replace(/(?:加缪会怎么看|从加缪角度|请问|我想问)/g, " ");
  const terms = new Set<string>();

  for (const token of normalized.match(/[a-z0-9][a-z0-9-]{1,}/g) ?? []) {
    terms.add(token);
  }

  for (const rawSegment of (normalized.match(/[\p{Script=Han}]{2,}/gu) ?? []).slice(0, 12)) {
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

  return [...terms].filter((term) => term.length >= 2);
}

function scoreCard(card: KnowledgeCard, terms: string[], intent: string): number {
  const title = card.title.toLowerCase();
  const tags = card.tags.join(" ").toLowerCase();
  const content = card.content.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 12;
    if (tags.includes(term)) score += 9;
    if (content.includes(term)) score += 1;
  }

  const boosted = INTENT_BOOSTS[intent] ?? [];
  const boostIndex = boosted.indexOf(card.id);
  if (boostIndex !== -1) score += 180 - boostIndex * 12;

  return score;
}

function getCard(id: string): KnowledgeCard {
  const card = CARD_BY_ID.get(id);
  if (!card) throw new Error(`Missing Camus knowledge card: ${id}`);
  return card;
}

export function retrieveCamusKnowledge(query: string): RetrievalResult {
  const intent = detectIntent(query);
  const terms = extractTerms(query);
  const scored = KNOWLEDGE.map((card) => ({
    card,
    score: scoreCard(card, terms, intent),
  })).sort((left, right) => right.score - left.score || left.card.id.localeCompare(right.card.id));

  const obviousHit = intent !== "general" || scored[0]?.score >= 18;
  if (!obviousHit) {
    return {
      cards: DEFAULT_CORE_IDS.map(getCard),
      sufficient: false,
      intent,
      matchedTerms: [],
    };
  }

  const selected = scored.filter(({ score }) => score > 0).slice(0, 4).map(({ card }) => card);
  if (!selected.some((card) => CORE_ID_PATTERN.test(card.id))) {
    const relevantCore = scored.find(
      ({ card, score }) => CORE_ID_PATTERN.test(card.id) && score > 0,
    )?.card;
    selected.push(relevantCore ?? getCard(DEFAULT_CORE_IDS[0]));
  }

  const uniqueCards = [...new Map(selected.map((card) => [card.id, card])).values()].slice(0, 5);
  const combined = uniqueCards
    .map((card) => `${card.title} ${card.tags.join(" ")} ${card.content}`.toLowerCase())
    .join(" ");

  return {
    cards: uniqueCards,
    sufficient: true,
    intent,
    matchedTerms: terms.filter((term) => combined.includes(term)).slice(0, 12),
  };
}
