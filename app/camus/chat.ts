import { buildRetrievedKnowledgeBlock } from "../persona/prompt";
import { retrieveCamusKnowledge } from "./retrieval";
import { CAMUS_CITATION_DISCIPLINE, CAMUS_SYSTEM_PROMPT } from "./system-prompt";

export function buildCamusInstructions(message: string): string {
  const retrieval = retrieveCamusKnowledge(message);
  const knowledgeBlock = buildRetrievedKnowledgeBlock(
    retrieval.cards,
    ["id", "title", "content", "evidence_type", "caveat", "sources"],
    retrieval.sufficient,
  );

  return [CAMUS_SYSTEM_PROMPT, knowledgeBlock, CAMUS_CITATION_DISCIPLINE].join(
    "\n\n",
  );
}

