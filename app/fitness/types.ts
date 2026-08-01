export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type FitnessKnowledgeModule = {
  id: string;
  name: string;
  keywords: readonly string[];
  dependsOn?: string;
  prompt: string;
};
