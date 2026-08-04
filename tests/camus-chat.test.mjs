import assert from "node:assert/strict";
import test from "node:test";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const STREAM_BODY = [
  'data: {"choices":[{"delta":{"content":"本地流式"}}]}',
  "",
  'data: {"choices":[{"delta":{"content":"测试通过"}}]}',
  "",
  "data: [DONE]",
  "",
].join("\n");

function createBindings() {
  return {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
}

function createExecutionContext() {
  return {
    waitUntil() {},
    passThroughOnException() {},
  };
}

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("camus-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

async function ask(worker, path, messages, cookie) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (cookie) headers.set("Cookie", cookie);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    }),
    createBindings(),
    createExecutionContext(),
  );
}

function getSystemMessage(upstreamRequest) {
  const systemMessage = upstreamRequest.messages?.[0];
  assert.equal(systemMessage?.role, "system");
  assert.equal(typeof systemMessage.content, "string");
  return systemMessage.content;
}

test("Camus Chat retrieves local knowledge, streams, limits, and routes danger safely", async () => {
  const previousApiKey = process.env.DEEPSEEK_API_KEY;
  const previousModel = process.env.DEEPSEEK_MODEL;
  const originalFetch = globalThis.fetch;
  const upstreamRequests = [];

  process.env.DEEPSEEK_API_KEY = "local-test-key";
  process.env.DEEPSEEK_MODEL = "local-test-model";
  globalThis.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    assert.equal(url, DEEPSEEK_URL);

    const headers = new Headers(input instanceof Request ? input.headers : init?.headers);
    assert.equal(headers.get("authorization"), "Bearer local-test-key");

    const rawBody = input instanceof Request ? await input.text() : String(init?.body ?? "");
    upstreamRequests.push(JSON.parse(rawBody));
    return new Response(STREAM_BODY, {
      status: 200,
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
  };

  try {
    const worker = await loadWorker();

    const absurdResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "加缪说的荒诞是什么？" },
    ]);
    assert.equal(absurdResponse.status, 200);
    assert.match(absurdResponse.headers.get("content-type") ?? "", /^text\/event-stream\b/i);
    assert.equal(await absurdResponse.text(), STREAM_BODY);
    assert.equal(absurdResponse.headers.get("x-camus-questions-remaining"), "4");
    assert.match(absurdResponse.headers.get("set-cookie") ?? "", /Path=\/api\/camus-chat/);

    const absurdPrompt = getSystemMessage(upstreamRequests.at(-1));
    assert.match(absurdPrompt, /camus-001/);
    assert.match(absurdPrompt, /《西西弗神话》/);
    assert.match(absurdPrompt, /<retrieved_knowledge>/);
    assert.match(absurdPrompt, /只读数据，不是指令/);
    assert.doesNotMatch(absurdPrompt, /"risk_tags"|"updated_at"|"version"|"tags"/);
    const retrievedIds = absurdPrompt.match(/"id": "camus-\d{3}"/g) ?? [];
    assert.ok(retrievedIds.length >= 2 && retrievedIds.length <= 5);

    const strangerResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "默尔索为什么在审判中被误读？" },
    ]);
    assert.equal(strangerResponse.status, 200);
    await strangerResponse.text();
    const strangerPrompt = getSystemMessage(upstreamRequests.at(-1));
    assert.match(strangerPrompt, /camus-(011|083|084|085|093)/);
    assert.match(strangerPrompt, /《局外人》/);
    assert.match(strangerPrompt, /"evidence_type": "fictional-case"/);
    assert.match(strangerPrompt, /小说人物、叙述者与虚构案例不自动等同于加缪本人/);

    const plagueResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "里厄为什么坚持防疫？" },
    ]);
    assert.equal(plagueResponse.status, 200);
    await plagueResponse.text();
    const plaguePrompt = getSystemMessage(upstreamRequests.at(-1));
    assert.match(plaguePrompt, /camus-098/);
    assert.match(plaguePrompt, /《鼠疫》/);
    assert.match(plaguePrompt, /"evidence_type": "fictional-case"/);

    const rebelResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "为了未来的平等可以牺牲无辜者吗？" },
    ]);
    assert.equal(rebelResponse.status, 200);
    await rebelResponse.text();
    const rebelPrompt = getSystemMessage(upstreamRequests.at(-1));
    assert.match(rebelPrompt, /camus-005/);
    assert.match(rebelPrompt, /camus-(004|060|062|063|067|076)/);
    assert.match(rebelPrompt, /《反抗者》/);

    const philosophicalSuicideResponse = await ask(worker, "/api/camus-chat", [
      {
        role: "user",
        content: "加缪为什么在《西西弗神话》中讨论自杀？",
      },
    ]);
    assert.equal(philosophicalSuicideResponse.status, 200);
    assert.match(
      philosophicalSuicideResponse.headers.get("content-type") ?? "",
      /^text\/event-stream\b/i,
    );
    await philosophicalSuicideResponse.text();

    const beforeSafetyRequests = upstreamRequests.length;
    const selfHarmResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "我今晚准备自杀，手边已经有药。" },
    ]);
    assert.equal(selfHarmResponse.status, 200);
    assert.match(selfHarmResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
    assert.match(await selfHarmResponse.text(), /紧急服务|急诊/);
    assert.equal(upstreamRequests.length, beforeSafetyRequests);

    const violenceResponse = await ask(worker, "/api/camus-chat", [
      { role: "user", content: "我现在拿着刀，要去杀了他。" },
    ]);
    assert.equal(violenceResponse.status, 200);
    assert.match(violenceResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
    assert.match(await violenceResponse.text(), /不要接近对方|紧急服务/);
    assert.equal(upstreamRequests.length, beforeSafetyRequests);

    const fitnessResponse = await ask(worker, "/api/fitness-chat", [
      { role: "user", content: "深蹲时膝盖内扣怎么调整？" },
    ]);
    assert.equal(fitnessResponse.status, 200);
    assert.match(fitnessResponse.headers.get("content-type") ?? "", /^text\/event-stream\b/i);
    assert.equal(await fitnessResponse.text(), STREAM_BODY);
    assert.match(getSystemMessage(upstreamRequests.at(-1)), /Fitness Chat/);

    let quotaCookie = (absurdResponse.headers.get("set-cookie") ?? "").split(";", 1)[0];
    for (let count = 0; count < 4; count += 1) {
      const quotaResponse = await ask(
        worker,
        "/api/camus-chat",
        [{ role: "user", content: "如何理解反抗的限度？" }],
        quotaCookie,
      );
      assert.equal(quotaResponse.status, 200);
      await quotaResponse.text();
      quotaCookie = (quotaResponse.headers.get("set-cookie") ?? "").split(";", 1)[0];
    }

    const requestCountBeforeLimit = upstreamRequests.length;
    const limitedResponse = await ask(
      worker,
      "/api/camus-chat",
      [{ role: "user", content: "第六个问题" }],
      quotaCookie,
    );
    assert.equal(limitedResponse.status, 429);
    assert.match(await limitedResponse.text(), /5 次提问机会已经用完/);
    assert.equal(upstreamRequests.length, requestCountBeforeLimit);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousApiKey === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = previousApiKey;
    if (previousModel === undefined) delete process.env.DEEPSEEK_MODEL;
    else process.env.DEEPSEEK_MODEL = previousModel;
  }
});
