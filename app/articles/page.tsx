import ArticleGrid from "../article-grid";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export default function ArticlesPage() {
  return (
    <main id="articles-page">
      <SiteHeader activePage="articles" />

      <div className="page-shell articles-page-shell">
        <section className="section articles-index-section" aria-labelledby="all-articles-title">
          <header className="articles-page-hero">
            <div className="articles-title-stack">
              <div className="articles-title-panel">
                <h1 id="all-articles-title">文章</h1>
              </div>
            </div>

            <div className="articles-page-intro">
              <h2>鲫鱼书舍</h2>
              <p className="articles-page-details">
                目前已形成 <strong>7</strong> 个文章合集，累计发表{" "}
                <strong>32</strong> 篇原创文章及贴图
                <br />
                账号总阅读量 <strong>10w+</strong>，篇均阅读量{" "}
                <strong>3.2k+</strong>，单篇最高阅读量 <strong>5.2w+</strong>
              </p>
            </div>
          </header>

          <ArticleGrid variant="index" />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
