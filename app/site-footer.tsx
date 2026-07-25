"use client";

import { useState, type FormEvent } from "react";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function SiteFooter() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setSubmitStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { success?: boolean };

      if (!response.ok || !result.success) {
        throw new Error("Message submission failed");
      }

      formElement.reset();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-contact">
        <h2>
          有任何想法和建议欢迎与我交流，
          <strong>我们一起进步！</strong>
        </h2>

        <p className="footer-form-intro">在这里直接给我发消息：</p>

        <form className="footer-contact-form" onSubmit={sendMessage}>
          <input
            className="footer-botcheck"
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <label htmlFor="footer-name">名字</label>
          <input
            id="footer-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="你的名字"
            required
          />

          <label htmlFor="footer-email">邮箱</label>
          <input
            id="footer-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="你的邮箱"
            required
          />

          <label htmlFor="footer-message">信息</label>
          <textarea
            id="footer-message"
            name="message"
            placeholder="我能帮你什么？"
            required
          />

          <button type="submit" disabled={submitStatus === "sending"}>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m21 3-8.7 18-2.5-7.8L2 10.7 21 3Z" />
              <path d="m9.8 13.2 5.2-5.1" />
            </svg>
            {submitStatus === "sending" ? "发送中…" : "发送"}
          </button>

          <p
            className={`footer-form-status footer-form-status-${submitStatus}`}
            role="status"
            aria-live="polite"
          >
            {submitStatus === "success" && "发送成功！我会尽快回复你。"}
            {submitStatus === "error" &&
              "发送失败，请稍后重试或发送邮件至 zjy_zzu@163.com。"}
            {(submitStatus === "idle" || submitStatus === "sending") &&
              "你的信息很安全。我会尽快回复你！"}
          </p>
        </form>
      </div>

      <div className="footer-bar">
        <a href="/" aria-label="返回首页">
          <img src="/jade-book-icon-thick.png" alt="" />
        </a>

        <p>身披焰衣，心沉冰海</p>

        <div className="footer-socials" aria-label="快捷链接">
          <a
            href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkxMTg2ODA2OQ=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问鲫鱼书舍微信公众号"
          >
            <img src="/wechat-channel-icon.png" alt="" />
          </a>
          <a
            href="https://v.douyin.com/DMb1Wly9fsc/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问鲫鱼书舍抖音账号"
          >
            <img src="/douyin-icon.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
}
