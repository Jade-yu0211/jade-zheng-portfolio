export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type KnowledgeSource = {
  work: string;
  edition?: string;
  locator?: string;
  evidence_type?: string;
  url?: string;
  accessed_at?: string;
};

export type KnowledgeCard = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  evidence_type: string;
  caveat?: string;
  risk_tags?: string[];
  sources: KnowledgeSource[];
};

export type RetrievalResult = {
  cards: KnowledgeCard[];
  sufficient: boolean;
  intent: string;
  matchedTerms: string[];
};

