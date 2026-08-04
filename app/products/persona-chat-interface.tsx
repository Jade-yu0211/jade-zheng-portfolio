"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { consumeOpenAIStream } from "./chat-interface";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  isIntro?: boolean;
};

type ModelErrorPayload = {
  message?: string;
  error?: { message?: string } | string;
  response?: { error?: { message?: string } | null };
};

type PersonaChatInterfaceProps = {
  title: string;
  avatar: string;
  intro: string;
  suggestions: string[];
  pendingReply?: string;
  note: string;
  apiPath?: string;
  knowledgeStatus?: "connected" | "pending";
};

const MAX_CONTEXT_MESSAGES = 6;
const FALLBACK_ERROR_MESSAGE = "聊天服务暂时无法连接，请稍后再试。";

function getErrorMessage(payload: unknown, fallback = FALLBACK_ERROR_MESSAGE) {
  if (!payload || typeof payload !== "object") return fallback;

  const data = payload as ModelErrorPayload;
  if (typeof data.error === "string" && data.error.trim()) return data.error.trim();
  if (data.error && typeof data.error === "object" && data.error.message?.trim()) {
    return data.error.message.trim();
  }
  if (data.response?.error?.message?.trim()) return data.response.error.message.trim();
  if (data.message?.trim()) return data.message.trim();
  return fallback;
}

async function readResponseMessage(response: Response) {
  const raw = await response.text();
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    try {
      return getErrorMessage(JSON.parse(raw));
    } catch {
      return raw.trim() || FALLBACK_ERROR_MESSAGE;
    }
  }

  return raw.trim() || FALLBACK_ERROR_MESSAGE;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export default function PersonaChatInterface({
  title,
  avatar,
  intro,
  suggestions,
  pendingReply,
  note,
  apiPath,
  knowledgeStatus,
}: PersonaChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, role: "assistant", content: intro, isIntro: true },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAwaitingFirstToken, setIsAwaitingFirstToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nextId = useRef(2);
  const replyTimerRef = useRef<number | null>(null);
  const messagesPanelRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inFlightRef = useRef(false);
  const resolvedStatus = knowledgeStatus ?? (apiPath ? "connected" : "pending");

  useEffect(() => {
    const messagesPanel = messagesPanelRef.current;
    if (!messagesPanel) return;

    const frame = window.requestAnimationFrame(() => {
      messagesPanel.scrollTo({
        top: messagesPanel.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, isSending, errorMessage]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const submitMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || inFlightRef.current) return;

    inFlightRef.current = true;
    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setIsAwaitingFirstToken(true);
    setErrorMessage(null);

    if (!apiPath) {
      replyTimerRef.current = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: nextId.current++,
            role: "assistant",
            content: pendingReply ?? "知识库正在接入中，请稍后再试。",
          },
        ]);
        inFlightRef.current = false;
        setIsSending(false);
        setIsAwaitingFirstToken(false);
        replyTimerRef.current = null;
      }, 520);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const requestMessages = nextMessages
      .filter((message) => !message.isIntro && message.content.trim())
      .slice(-MAX_CONTEXT_MESSAGES)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent.trim(),
      }));

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readResponseMessage(response));
      }

      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

      if (contentType.includes("text/event-stream")) {
        const assistantId = nextId.current++;
        let receivedDelta = false;

        await consumeOpenAIStream(response, (delta) => {
          if (!delta) return;

          if (!receivedDelta) {
            receivedDelta = true;
            setIsAwaitingFirstToken(false);
            setMessages((current) => [
              ...current,
              { id: assistantId, role: "assistant", content: delta },
            ]);
            return;
          }

          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + delta }
                : message,
            ),
          );
        });

        if (!receivedDelta && !controller.signal.aborted) {
          throw new Error("模型没有返回可显示的回答。");
        }
      } else if (contentType.includes("text/plain")) {
        const reply = (await response.text()).trim();
        if (!reply) throw new Error("模型没有返回可显示的回答。");

        setIsAwaitingFirstToken(false);
        setMessages((current) => [
          ...current,
          { id: nextId.current++, role: "assistant", content: reply },
        ]);
      } else {
        throw new Error(await readResponseMessage(response));
      }
    } catch (error) {
      if (!isAbortError(error)) {
        setErrorMessage(
          error instanceof Error && error.message.trim()
            ? error.message
            : FALLBACK_ERROR_MESSAGE,
        );
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        inFlightRef.current = false;
        setIsSending(false);
        setIsAwaitingFirstToken(false);
      }
    }
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
    inFlightRef.current = false;
    setIsSending(false);
    setIsAwaitingFirstToken(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(input);
    }
  };

  return (
    <div className="chat-window" aria-label={`${title} 聊天窗口`}>
      <header className="chat-window-header">
        <div className="chat-window-identity">
          <span className="chat-window-avatar" aria-hidden="true">
            {avatar}
          </span>
          <span>
            <strong>{title}</strong>
          </span>
        </div>
        <span
          className={`chat-window-status${
            resolvedStatus === "pending" ? " chat-window-status--pending" : ""
          }`}
        >
          <i aria-hidden="true" />
          {resolvedStatus === "connected" ? "知识库已接入" : "知识库待接入"}
        </span>
      </header>

      <div
        className="chat-window-messages"
        ref={messagesPanelRef}
        aria-live="polite"
        aria-busy={isSending}
      >
        <p className="chat-window-date">今天</p>
        {messages.map((message) => (
          <div
            className={`chat-message chat-message--${message.role}`}
            key={message.id}
          >
            {message.role === "assistant" ? (
              <span className="chat-message-avatar" aria-hidden="true">
                {avatar}
              </span>
            ) : null}
            <p>{message.content}</p>
          </div>
        ))}
        {errorMessage ? (
          <div className="chat-message chat-message--assistant" role="alert">
            <span className="chat-message-avatar" aria-hidden="true">
              {avatar}
            </span>
            <p>{errorMessage}</p>
          </div>
        ) : null}
        {isSending && isAwaitingFirstToken ? (
          <div className="chat-message chat-message--assistant">
            <span className="chat-message-avatar" aria-hidden="true">
              {avatar}
            </span>
            <p className="chat-typing" aria-label="正在回复">
              <i />
              <i />
              <i />
            </p>
          </div>
        ) : null}
      </div>

      <div className="chat-suggestions" aria-label="快捷提问">
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            onClick={() => void submitMessage(suggestion)}
            disabled={isSending}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <textarea
          aria-label="输入聊天消息"
          placeholder="在这里输入消息..."
          rows={1}
          value={input}
          maxLength={2000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type={isSending ? "button" : "submit"}
          disabled={!isSending && !input.trim()}
          onClick={isSending ? stopGeneration : undefined}
          aria-label={isSending ? "停止生成" : "发送消息"}
        >
          {isSending ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <rect
                x="7"
                y="7"
                width="10"
                height="10"
                rx="1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          )}
        </button>
      </form>
      <p className="chat-window-note">{note}</p>
    </div>
  );
}
