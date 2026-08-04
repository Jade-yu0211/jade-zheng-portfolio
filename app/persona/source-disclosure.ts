const SOURCE_CONTEXT_PATTERN =
  /(蒸馏|训练|基于|参考|使用|用了|用的|读过|读了|知识库|知识|资料|内容|依据)/i;
const SOURCE_DETAILS_PATTERN =
  /(书|作品|原作|文本|译本|版本|翻译|出版社|isbn|页码)/i;
const SOURCE_QUESTION_PATTERN = /(哪|什么|哪些|来源|版本|译本|翻译|出版社|isbn|页码)/i;
const DIRECT_SOURCE_PATTERN = /(知识|资料|内容).{0,6}(来源|来自哪里|从哪里来)/;

function isSourceDisclosureQuestion(message: string): boolean {
  const normalized = message.replace(/\s+/g, "").toLowerCase();
  return (
    DIRECT_SOURCE_PATTERN.test(normalized) ||
    (SOURCE_CONTEXT_PATTERN.test(normalized) &&
      SOURCE_DETAILS_PATTERN.test(normalized) &&
      SOURCE_QUESTION_PATTERN.test(normalized))
  );
}

export function getCamusSourceReply(message: string): string | null {
  if (!isSourceDisclosureQuestion(message)) return null;

  return "内容由《西西弗神话》《反抗者》《鼠疫》《局外人》的外文原作直接翻译整理，中文书名仅借用通行译名。";
}

export function getAdlerSourceReply(message: string): string | null {
  if (!isSourceDisclosureQuestion(message)) return null;

  return "内容由《自卑与超越》《理解人性》《儿童教育心理学》的外文原作直接翻译整理，中文书名仅借用通行译名。";
}
