import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";
import ChatInterface from "./chat-interface";

export default function ProductsPage() {
  return (
    <main id="products-page">
      <SiteHeader activePage="products" />

      <div className="page-shell products-page-shell">
        <section className="section products-chat-section" aria-labelledby="fitness-chat-title">
          <header className="products-page-hero">
            <div className="products-page-intro">
              <h1 id="fitness-chat-title">Fitness Chat</h1>
              <p>使用Github上最热门的Cangjie和Nuwa两个skill，蒸馏顶级健身博主的教学视频合集，构建知识库以及人物心智模型，解答动作、营养与体态等训练问题</p>
            </div>
          </header>

          <ChatInterface />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
