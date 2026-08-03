type ProductPreview = {
  slug: string;
  title: string;
  avatar: string;
  href: string;
  tags: string[];
  description: string;
  messages: Array<{
    role: "assistant" | "user";
    text: string;
  }>;
};

const products: ProductPreview[] = [
  {
    slug: "fitness",
    title: "Fitness Chat",
    avatar: "F",
    href: "/products",
    tags: ["AI问答", "知识蒸馏", "健身知识库"],
    description:
      "蒸馏顶级健身博主的教学视频合集，构建知识库以及人物心智模型，解答动作、营养与体态等训练问题",
    messages: [
      { role: "assistant", text: "你好，今天想解决什么训练问题？" },
      { role: "user", text: "深蹲时膝盖内扣该怎么调整" },
    ],
  },
  {
    slug: "camus",
    title: "Camus Chat",
    avatar: "C",
    href: "/products/camus",
    tags: ["AI问答", "人物心智模型", "荒诞哲学"],
    description:
      "蒸馏加缪的《西西弗神话》和《反抗者》等 5 本经典著作，构建加缪的人物心智模型，通过对话畅聊荒诞哲学",
    messages: [
      { role: "user", text: "如果人生没有终极意义，为什么还要起床？" },
      {
        role: "assistant",
        text: "荒诞不是睡回去的理由。清醒地生活，就是今天的反抗。",
      },
    ],
  },
  {
    slug: "adler",
    title: "Adler Chat",
    avatar: "A",
    href: "/products/adler",
    tags: ["AI问答", "人物心智模型", "个体心理学"],
    description:
      "蒸馏阿德勒的《自卑与超越》等 3 本经典著作，构建阿德勒的人物心智模型，从个体心理学角度解答心理问题",
    messages: [
      { role: "user", text: "总有人比我优秀，我还怎么超越自己？" },
      {
        role: "assistant",
        text: "别把人生过成排名。自卑是起点，贡献与合作才是方向。",
      },
    ],
  },
];

function ProductCard({ product }: { product: ProductPreview }) {
  return (
    <a
      className="product-showcase-card"
      href={product.href}
      aria-label={`打开 ${product.title} 聊天窗口`}
    >
      <div className="product-showcase-visual">
        <div className="product-chat-preview" aria-hidden="true">
          <div className="product-chat-preview-bar">
            <span className="product-chat-preview-avatar">{product.avatar}</span>
            <span>
              <b>{product.title}</b>
            </span>
            <i />
          </div>
          <div className="product-chat-preview-messages">
            {product.messages.map((message) => (
              <p
                className={`product-chat-bubble product-chat-bubble--${message.role}`}
                key={message.text}
              >
                {message.text}
              </p>
            ))}
          </div>
          <div className="product-chat-preview-composer">
            <span>输入消息...</span>
            <span className="product-chat-preview-send">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="product-showcase-copy">
        <h3>{product.title}</h3>
        <div
          className="product-showcase-tags"
          aria-label={`${product.title} 关键词`}
        >
          {product.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{product.description}</p>
        <span className="product-showcase-cta">
          打开聊天窗口
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h13M13 7l5 5-5 5" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function ProductShowcase() {
  return (
    <div className="product-showcase-grid">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
