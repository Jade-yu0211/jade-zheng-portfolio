import { buildRetrievedKnowledgeBlock } from "../persona/prompt";
import { retrieveAdlerKnowledge } from "./retrieval";
import { ADLER_CITATION_DISCIPLINE, ADLER_SYSTEM_PROMPT } from "./system-prompt";

export function buildAdlerInstructions(message: string): string {
  const retrieval = retrieveAdlerKnowledge(message);
  const knowledgeBlock = buildRetrievedKnowledgeBlock(
    retrieval.cards,
    [
      "id",
      "title",
      "content",
      "evidence_type",
      "caveat",
      "risk_tags",
      "sources",
    ],
    retrieval.sufficient,
  );

  return [ADLER_SYSTEM_PROMPT, knowledgeBlock, ADLER_CITATION_DISCIPLINE].join(
    "\n\n",
  );
}

