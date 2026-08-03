export default function ProductShowcase() {
  return (
    <a
      className="product-showcase-card"
      href="/products"
      aria-label="打开 Fitness Chat 聊天窗口"
    >
      <div className="product-showcase-visual">
        <div className="product-chat-preview" aria-hidden="true">
          <div className="product-chat-preview-bar">
            <span className="product-chat-preview-avatar">F</span>
            <span>
              <b>Fitness Chat</b>
            </span>
            <i />
          </div>
          <div className="product-chat-preview-messages">
            <p className="product-chat-bubble product-chat-bubble--assistant">
              你好，今天想解决什么训练问题？
            </p>
            <p className="product-chat-bubble product-chat-bubble--user">
              深蹲时膝盖内扣该怎么调整
            </p>
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
        <h3>Fitness Chat</h3>
        <div className="product-showcase-tags" aria-label="产品关键词">
          <span>AI问答</span>
          <span>知识蒸馏</span>
          <span>健身知识库</span>
        </div>
        <p>蒸馏顶级健身博主的教学视频合集，构建知识库以及人物心智模型，解答动作、营养与体态等训练问题</p>
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
