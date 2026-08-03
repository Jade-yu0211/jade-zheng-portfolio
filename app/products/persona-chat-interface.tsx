"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

type PersonaChatInterfaceProps = {
  title: string;
  avatar: string;
  intro: string;
  suggestions: string[];
  pendingReply: string;
  note: string;
};

export default function PersonaChatInterface({
  title,
  avatar,
  intro,
  suggestions,
  pendingReply,
  note,
}: PersonaChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, role: "assistant", content: intro },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const nextId = useRef(2);
  const replyTimerRef = useRef<number | null>(null);
  const messagesPanelRef = useRef<HTMLDivElement>(null);

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
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const submitMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", content: trimmed },
    ]);
    setInput("");
    setIsSending(true);

    replyTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "assistant", content: pendingReply },
      ]);
      setIsSending(false);
      replyTimerRef.current = null;
    }, 520);
  };

  const stopGeneration = () => {
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
    setIsSending(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage(input);
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
        <span className="chat-window-status chat-window-status--pending">
          <i aria-hidden="true" /> 知识库待接入
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
        {isSending ? (
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
            onClick={() => submitMessage(suggestion)}
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
