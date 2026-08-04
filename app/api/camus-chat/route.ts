import { buildCamusInstructions } from "../../camus/chat";
import { createPersonaChatHandler } from "../../persona/server";
import { getCamusImmediateSafetyReply } from "../../persona/safety";
import { getCamusSourceReply } from "../../persona/source-disclosure";

export const runtime = "nodejs";

export const POST = createPersonaChatHandler({
  displayName: "Camus Chat",
  cookieName: "camus_chat_quota",
  cookiePath: "/api/camus-chat",
  emptyQuestionMessage: "请先输入一个想与 Camus Chat 讨论的问题。",
  buildInstructions: buildCamusInstructions,
  getImmediateSafetyReply: getCamusImmediateSafetyReply,
  getDirectReply: getCamusSourceReply,
});
