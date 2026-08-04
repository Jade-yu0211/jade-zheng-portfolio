import type { Metadata } from "next";
import PersonaProductPage from "../persona-product-page";

export const metadata: Metadata = {
  title: "Adler Chat | Jade Zheng",
  description: "从个体心理学角度讨论自卑、目标、关系与生活方式。",
};

export default function AdlerChatPage() {
  return (
    <PersonaProductPage
      slug="adler-chat"
      title="Adler Chat"
      description="使用Github上开源的Nuwa.skill蒸馏《自卑与超越》、《理解人性》以及《儿童教育心理学》这3本阿德勒的代表作，构建人物心智模型，从个体心理学角度提供心理建议"
      avatar="A"
      intro="你好，我是 Adler Chat。你可以向我询问自卑、目标、关系、合作与生活方式等个体心理学问题。"
      suggestions={[
        "总有人比我优秀，我该怎么超越自己？",
        "自卑感一定是坏事吗？",
        "如何停止过度在意他人的评价？",
      ]}
      endpoint="/api/adler-chat"
      note="Adler Chat 也可能会犯错。回答内容仅供参考，并非医疗建议或心理诊断"
    />
  );
}
