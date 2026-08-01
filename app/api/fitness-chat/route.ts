import { NextResponse } from "next/server";
import { FITNESS_CORE_PROMPT, OUT_OF_SCOPE_PROMPT } from "../../fitness/core-prompt";
import {
  getImmediateSafetyReply,
  isLikelyOffTopic,
  routeFitnessKnowledge,
} from "../../fitness/router";
import type { ChatMessage } from "../../fitness/types";

export const runtime = "edge";

const MAX_MESSAGES = 6;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_TOTAL_LENGTH = 6_000;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

async function createSafetyIdentifier(request: Request): Promise<string> {
  const forwardedFor = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]
    ?? "anonymous";
  const salt = process.env.FITNESS_SAFETY_SALT ?? "fitness-chat";
  const bytes = new TextEncoder().encode(`${salt}:${forwardedFor.trim()}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function plainTextResponse(content: string, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Fitness Chat 尚未配置 OPENAI_API_KEY，请先在部署平台添加环境变量。",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式不正确。" }, { status: 400 });
  }

  const incomingMessages =
    body && typeof body === "object" && Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: unknown[] }).messages
      : null;

  if (!incomingMessages || incomingMessages.length === 0) {
    return NextResponse.json({ error: "请先输入一个健身问题。" }, { status: 400 });
  }

  const messages = incomingMessages
    .filter(isChatMessage)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);

  const totalLength = messages.reduce((total, message) => total + message.content.length, 0);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage || totalLength > MAX_TOTAL_LENGTH) {
    return NextResponse.json(
      { error: "对话内容过长，请清空会话或把问题缩短后再试。" },
      { status: 400 },
    );
  }

  const immediateSafetyReply = getImmediateSafetyReply(latestUserMessage.content);
  if (immediateSafetyReply) {
    return plainTextResponse(immediateSafetyReply);
  }

  const selectedModules = routeFitnessKnowledge(latestUserMessage.content);
  const instructions = [
    FITNESS_CORE_PROMPT,
    isLikelyOffTopic(latestUserMessage.content) ? OUT_OF_SCOPE_PROMPT : "",
    ...selectedModules.map((module) => module.prompt),
  ]
    .filter(Boolean)
    .join("\n\n");

  const safetyIdentifier = await createSafetyIdentifier(request);
  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.FITNESS_MODEL ?? "gpt-5.6-luna",
      instructions,
      input: messages,
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
      max_output_tokens: 900,
      safety_identifier: safetyIdentifier,
      store: false,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    let message = "模型暂时无法回答，请稍后再试。";
    try {
      const failure = (await upstream.json()) as { error?: { message?: string } };
      if (failure.error?.message && process.env.NODE_ENV !== "production") {
        message = failure.error.message;
      }
    } catch {
      // Keep the public error intentionally generic.
    }

    return NextResponse.json({ error: message }, { status: upstream.status || 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
