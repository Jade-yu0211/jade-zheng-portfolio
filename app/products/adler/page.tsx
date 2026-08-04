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
      description="蒸馏阿德勒的《自卑与超越》等 3 本经典著作，构建阿德勒的人物心智模型，从个体心理学角度解答心理问题"
      avatar="A"
      intro="你好，我是 Adler Chat。你可以向我询问自卑、目标、关系、合作与生活方式等个体心理学问题。"
      suggestions={[
        "总有人比我优秀，我该怎么超越自己？",
        "自卑感一定是坏事吗？",
        "如何停止过度在意他人的评价？",
      ]}
      endpoint="/api/adler-chat"
      note="Adler Chat 也可能会犯错。心理建议仅供参考，不构成医疗建议或心理诊断。"
    />
  );
}
