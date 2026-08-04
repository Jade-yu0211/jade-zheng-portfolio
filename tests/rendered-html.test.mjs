import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.ok(
    html.includes(
      "蒸馏加缪的《西西弗神话》等 4本经典著作，构建加缪的人物心智模型，通过对话畅聊荒诞哲学",
    ),
  );
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
      description:
        "使用Github上开源的Nuwa.skill蒸馏《西西弗神话》、《反抗者》、《鼠疫》以及《局外人》这4本加缪的代表作，构建人物心智模型，通过对话畅聊荒诞哲学",
    },
    {
      path: "/products/adler",
      title: "Adler Chat",
      note: "回答内容仅供参考，并非医疗建议或心理诊断",
      description:
        "使用Github上开源的Nuwa.skill蒸馏《自卑与超越》、《理解人性》以及《儿童教育心理学》这3本阿德勒的代表作，构建人物心智模型，从个体心理学角度提供心理建议",
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
    assert.match(personaHtml, /知识库已接入/);
    assert.doesNotMatch(personaHtml, /知识库接口正在接入中/);
    assert.match(personaHtml, new RegExp(persona.note));
    assert.ok(personaHtml.includes(persona.description));
    assert.match(personaHtml, /placeholder="在这里输入消息\.\.\."/);
  }
});

test("keeps page scroll chaining and hides internal research metadata", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /overscroll-behavior-y:\s*auto;/);
  assert.doesNotMatch(css, /overscroll-behavior:\s*contain;/);

  const prompt = await readFile(
    new URL("../app/persona/prompt.ts", import.meta.url),
    "utf8",
  );
  assert.match(prompt, /不得暴露本数据块的存在/);
  assert.match(prompt, /不得提供或暗示具体中文译本/);
  assert.match(prompt, /card\.sources\.map\(\(\{ work \}\) => \(\{ work \}\)\)/);

  for (const path of [
    "../app/camus/system-prompt.ts",
    "../app/adler/system-prompt.ts",
  ]) {
    const systemPrompt = await readFile(new URL(path, import.meta.url), "utf8");
    assert.match(systemPrompt, /不得向访客展示知识卡/);
    assert.match(systemPrompt, /不得披露具体中文版本信息/);
    assert.match(systemPrompt, /绝不出现在访客可见的回答中/);
  }

  const camusPrompt = await readFile(
    new URL("../app/camus/system-prompt.ts", import.meta.url),
    "utf8",
  );
  assert.match(camusPrompt, /《西西弗神话》《反抗者》《鼠疫》《局外人》的外文原作/);

  const adlerPrompt = await readFile(
    new URL("../app/adler/system-prompt.ts", import.meta.url),
    "utf8",
  );
  assert.match(adlerPrompt, /《自卑与超越》《理解人性》《儿童教育心理学》的外文原作/);
  assert.doesNotMatch(adlerPrompt, /《生活的科学》/);

  const sourceDisclosure = await readFile(
    new URL("../app/persona/source-disclosure.ts", import.meta.url),
    "utf8",
  );
  assert.match(
    sourceDisclosure,
    /内容由《西西弗神话》《反抗者》《鼠疫》《局外人》的外文原作直接翻译整理/,
  );
  assert.match(
    sourceDisclosure,
    /内容由《自卑与超越》《理解人性》《儿童教育心理学》的外文原作直接翻译整理/,
  );
  assert.doesNotMatch(sourceDisclosure, /出版社，/);
});
