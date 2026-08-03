import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(
    html,
    /href="https:\/\/mp\.weixin\.qq\.com\/s\/zjvGITvzUYdeB-zPcVOc7A"[^>]*target="_blank"/,
  );
  assert.match(html, /src="\/jade-book-icon-thick\.png"/);
  assert.match(html, /class="experience-heading"[\s\S]*?<h2>个人经历<\/h2>/);
  assert.match(html, /id="products"/);
  assert.match(html, /aria-label="打开 Fitness Chat 聊天窗口"/);
  assert.match(html, /href="\/products"/);
  assert.match(html, /aria-label="打开 Camus Chat 聊天窗口"/);
  assert.match(html, /href="\/products\/camus"/);
  assert.match(html, /aria-label="打开 Adler Chat 聊天窗口"/);
  assert.match(html, /href="\/products\/adler"/);
  assert.doesNotMatch(html, />\s*ARTICLES\s*</);
  assert.doesNotMatch(html, />\s*VIDEO\s*</);
  assert.doesNotMatch(html, /class="section about-section"/);
  assert.doesNotMatch(html, /class="contact-section"/);
  assert.doesNotMatch(html, /如果你也对数据、商业或阅读感兴趣/);
  assert.match(html, /class="footer-contact"/);
  assert.match(html, /class="footer-contact-form"/);
  assert.match(html, /有任何想法和建议欢迎与我交流/);
  assert.doesNotMatch(html, /电子邮件联系方式/);
  assert.match(html, /在这里直接给我发消息/);
  assert.match(html, /placeholder="你的名字"/);
  assert.match(html, /placeholder="你的邮箱"/);

  const personaPages = [
    {
      path: "/products/camus",
      title: "Camus Chat",
      note: "内容仅供思想交流，请核查作品与重要信息。",
    },
    {
      path: "/products/adler",
      title: "Adler Chat",
      note: "心理建议仅供参考，不构成医疗建议或心理诊断。",
    },
  ];

  for (const persona of personaPages) {
    const personaResponse = await worker.fetch(
      new Request(`http://localhost${persona.path}`, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );

    assert.equal(personaResponse.status, 200);
    const personaHtml = await personaResponse.text();
    assert.match(personaHtml, new RegExp(persona.title));
    assert.match(personaHtml, /知识库待接入/);
    assert.match(personaHtml, new RegExp(persona.note));
    assert.match(personaHtml, /placeholder="在这里输入消息\.\.\."/);
  }
});
