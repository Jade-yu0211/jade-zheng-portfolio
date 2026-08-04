import { NextResponse } from "next/server";
import type { ChatMessage } from "./types";

export const PERSONA_CHAT_RUNTIME = "nodejs";

const MAX_MESSAGES = 6;
const MAX_MESSAGE_LENGTH = 1_200;
const MAX_TOTAL_LENGTH = 6_000;
const DAILY_QUESTION_LIMIT = 5;
const QUOTA_COOKIE_MAX_AGE = 60 * 60 * 48;
const VISITOR_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DailyQuota = {
  day: string;
  count: number;
  visitorId: string;
};

type PersonaChatConfig = {
  displayName: string;
  cookieName: string;
  cookiePath: string;
  emptyQuestionMessage: string;
  buildInstructions: (message: string) => string;
  getImmediateSafetyReply: (message: string) => string | null;
  getDirectReply?: (message: string) => string | null;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

async function createSafetyIdentifier(request: Request, namespace: string): Promise<string> {
  const forwardedFor =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "anonymous";
  const salt = process.env.FITNESS_SAFETY_SALT ?? "persona-chat";
  const bytes = new TextEncoder().encode(
    `${salt}:${namespace}:${forwardedFor.trim()}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getShanghaiDay(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator === -1) continue;
    if (cookie.slice(0, separator).trim() === name) {
      return cookie.slice(separator + 1).trim();
    }
  }

  return null;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

async function signQuotaPayload(encodedPayload: string, cookieName: string): Promise<string> {
  const secret =
    process.env.FITNESS_SAFETY_SALT ??
    process.env.DEEPSEEK_API_KEY ??
    "persona-chat";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${cookieName}:${encodedPayload}`),
  );

  return Buffer.from(signature).toString("base64url");
}

async function readDailyQuota(request: Request, cookieName: string): Promise<DailyQuota> {
  const today = getShanghaiDay();
  const freshQuota = (): DailyQuota => ({
    day: today,
    count: 0,
    visitorId: crypto.randomUUID(),
  });
  const blockedQuota = (): DailyQuota => ({
    ...freshQuota(),
    count: DAILY_QUESTION_LIMIT,
  });
  const cookie = getCookie(request, cookieName);
  if (!cookie) return freshQuota();

  const [encodedPayload, suppliedSignature, ...extra] = cookie.split(".");
  if (!encodedPayload || !suppliedSignature || extra.length > 0) return blockedQuota();

  const expectedSignature = await signQuotaPayload(encodedPayload, cookieName);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return blockedQuota();

  try {
    const value = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<DailyQuota>;
    const isValid =
      typeof value.day === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(value.day) &&
      Number.isInteger(value.count) &&
      typeof value.count === "number" &&
      value.count >= 0 &&
      value.count <= DAILY_QUESTION_LIMIT &&
      typeof value.visitorId === "string" &&
      VISITOR_ID_PATTERN.test(value.visitorId);

    if (!isValid) return blockedQuota();
    if (value.day !== today) return freshQuota();
    return value as DailyQuota;
  } catch {
    return blockedQuota();
  }
}

async function serializeDailyQuota(
  quota: DailyQuota,
  cookieName: string,
  cookiePath: string,
): Promise<string> {
  const encodedPayload = Buffer.from(JSON.stringify(quota)).toString("base64url");
  const signature = await signQuotaPayload(encodedPayload, cookieName);

  return [
    `${cookieName}=${encodedPayload}.${signature}`,
    `Path=${cookiePath}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${QUOTA_COOKIE_MAX_AGE}`,
  ].join("; ");
}

function attachQuotaHeaders(response: Response, cookie: string, remaining: number): Response {
  response.headers.set("Set-Cookie", cookie);
  response.headers.set("X-Questions-Remaining", String(remaining));
  return response;
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

export function createPersonaChatHandler(config: PersonaChatConfig) {
  return async function POST(request: Request) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: `${config.displayName} 尚未配置 DEEPSEEK_API_KEY，请先在部署平台添加环境变量。`,
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
      body &&
      typeof body === "object" &&
      Array.isArray((body as { messages?: unknown }).messages)
        ? (body as { messages: unknown[] }).messages
        : null;

    if (!incomingMessages || incomingMessages.length === 0) {
      return NextResponse.json({ error: config.emptyQuestionMessage }, { status: 400 });
    }

    const messages = incomingMessages
      .filter(isChatMessage)
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
      }))
      .filter((message) => message.content.length > 0)
      .slice(-MAX_MESSAGES);

    const totalLength = messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!latestUserMessage || totalLength > MAX_TOTAL_LENGTH) {
      return NextResponse.json(
        { error: "对话内容过长，请清空会话或把问题缩短后再试。" },
        { status: 400 },
      );
    }

    const currentQuota = await readDailyQuota(request, config.cookieName);
    if (currentQuota.count >= DAILY_QUESTION_LIMIT) {
      const quotaCookie = await serializeDailyQuota(
        currentQuota,
        config.cookieName,
        config.cookiePath,
      );
      const response = NextResponse.json(
        { error: "今天的 5 次提问机会已经用完，请明天再来。" },
        { status: 429 },
      );
      response.headers.set("Retry-After", "86400");
      return attachQuotaHeaders(response, quotaCookie, 0);
    }

    const nextQuota: DailyQuota = {
      ...currentQuota,
      count: currentQuota.count + 1,
    };
    const quotaCookie = await serializeDailyQuota(
      nextQuota,
      config.cookieName,
      config.cookiePath,
    );
    const remainingQuestions = DAILY_QUESTION_LIMIT - nextQuota.count;

    const immediateSafetyReply = config.getImmediateSafetyReply(latestUserMessage.content);
    if (immediateSafetyReply) {
      return attachQuotaHeaders(
        plainTextResponse(immediateSafetyReply),
        quotaCookie,
        remainingQuestions,
      );
    }

    const directReply = config.getDirectReply?.(latestUserMessage.content);
    if (directReply) {
      return attachQuotaHeaders(
        plainTextResponse(directReply),
        quotaCookie,
        remainingQuestions,
      );
    }

    const instructions = config.buildInstructions(latestUserMessage.content);
    const safetyIdentifier = await createSafetyIdentifier(request, config.cookieName);

    let upstream: Response;
    try {
      upstream = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
          messages: [{ role: "system", content: instructions }, ...messages],
          thinking: { type: "disabled" },
          max_tokens: 900,
          user_id: safetyIdentifier,
          stream: true,
        }),
      });
    } catch {
      return NextResponse.json(
        { error: "模型服务暂时无法连接，请稍后再试。" },
        { status: 502 },
      );
    }

    if (!upstream.ok || !upstream.body) {
      let message = "模型暂时无法回答，请稍后再试。";
      try {
        const failure = (await upstream.json()) as { error?: { message?: string } };
        if (upstream.status === 401) {
          message = "DeepSeek API Key 无效或已失效，请检查部署环境变量。";
        } else if (upstream.status === 402) {
          message = "DeepSeek API 余额不足，请充值后再试。";
        } else if (upstream.status === 429) {
          message = "请求过于频繁，请稍后再试。";
        } else if (failure.error?.message && process.env.NODE_ENV !== "production") {
          message = failure.error.message;
        }
      } catch {
        // Keep the public error intentionally generic.
      }

      return NextResponse.json({ error: message }, { status: upstream.status || 502 });
    }

    return attachQuotaHeaders(
      new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-store, no-transform",
          "X-Accel-Buffering": "no",
        },
      }),
      quotaCookie,
      remainingQuestions,
    );
  };
}
