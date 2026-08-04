import { buildAdlerInstructions } from "../../adler/chat";
import { createPersonaChatHandler } from "../../persona/server";
import { getAdlerImmediateSafetyReply } from "../../persona/safety";

export const runtime = "nodejs";

export const POST = createPersonaChatHandler({
  displayName: "Adler Chat",
  cookieName: "adler_chat_quota",
  cookiePath: "/api/adler-chat",
  emptyQuestionMessage: "请先输入一个想与 Adler Chat 讨论的问题。",
  buildInstructions: buildAdlerInstructions,
  getImmediateSafetyReply: getAdlerImmediateSafetyReply,
});

