import type { Metadata } from "next";
import PersonaProductPage from "../persona-product-page";

export const metadata: Metadata = {
  title: "Camus Chat | Jade Zheng",
  description: "通过对话讨论加缪作品中的荒诞、反抗、自由与限度。",
};

export default function CamusChatPage() {
  return (
    <PersonaProductPage
      slug="camus-chat"
      title="Camus Chat"
      description="使用Github上开源的Nuwa.skill蒸馏《西西弗神话》、《反抗者》、《鼠疫》以及《局外人》这4本加缪的代表作，构建人物心智模型，通过对话畅聊荒诞哲学"
      avatar="C"
      intro="你好，我是 Camus Chat。你可以与我讨论荒诞、反抗、自由、幸福与限度等问题。"
      suggestions={[
        "如果人生没有终极意义，为什么还要生活？",
        "反抗与怨恨有什么不同？",
        "如何理解西西弗的幸福？",
      ]}
      endpoint="/api/camus-chat"
      note="Camus Chat 也可能会犯错。内容仅供思想交流，请核查作品与重要信息。"
    />
  );
}
