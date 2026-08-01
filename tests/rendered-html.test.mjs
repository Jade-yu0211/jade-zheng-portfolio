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
});
