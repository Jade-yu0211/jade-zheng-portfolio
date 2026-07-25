import ArticleGrid from "./article-grid";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import VideoGrid from "./video-grid";

const experiences = [
  {
    period: "2025/09 — 2028/06",
    title: "西南财经大学",
    role: "世界经济硕士",
    description:
      "绩点 4.04/5，专业排名 1/10（截止 2026/09）。在校期间参与国家自然科学基金一般项目，获得西南财经大学研究生一等学业奖学金等荣誉，在微信公众平台、抖音短视频平台创立人文阅读类账号「鲫鱼书舍」。",
  },
  {
    period: "2023/12 — 2024/01",
    title: "信永中和会计师事务所成都分所",
    role: "审计助理",
    description:
      "跟随审计项目组前往成都、绵阳参与某大型国企上市公司年终审计项目。",
    details:
      "作为组长带领项目审计助理前往湖北荆州、四川江油等地实地盘点；确定数百类存货的市场公允价值。参与资产负债表合并期初工作；负责项目组的日常费用统计核销；协助项目经理完成审计底稿的编制。",
  },
  {
    period: "2021/09 — 2025/06",
    title: "郑州大学",
    role: "经济学学士",
    description:
      "绩点 3.73/4，专业排名 7/200。通过研究数据要素对制造业“四链”融合的促进作用获得经济学学士学位，并荣获郑州大学 2025 届优秀毕业论文。在校期间担任专业学生干部、参与国家社会科学基金重点项目、河南省大学生创新创业训练项目，获得郑州大学三好学生、郑州大学优秀学生干部、郑州大学优秀学生奖学金等多项荣誉。",
  },
];

export default function Home() {
  return (
    <main id="home">
      <SiteHeader activePage="home" />

      <div className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-visual" aria-label="Jade Zheng 的个人照片">
            <div className="visual-glow" />
            <div className="portrait-card">
              <img
                className="hero-portrait"
                src="/jade-zheng-portrait.jpg"
                alt="Jade Zheng 在公交车上的个人照片"
              />
            </div>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">欢迎来到我的个人网站 <span>👋</span></p>
            <h1 id="hero-title">Jade Zheng</h1>
            <p className="hero-intro">
              经济学在读研究生，研究领域为数字金融与数据要素
              <br />
              读书博主，微信公众号&amp;抖音短视频平台「鲫鱼书舍」创作者
              <br />
              兴趣爱好：阅读、健身、AI编程
            </p>
            <div className="hero-actions">
              <div className="joan-button-shell">
                <a className="button button-primary" href="#contact">
                  <svg
                    className="button-icon"
                    viewBox="0 0 15 15"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M1 2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm0 1h13v.925a.45.45 0 0 0-.241.07L7.5 7.967 1.241 3.995A.45.45 0 0 0 1 3.925zm0 1.908V12h13V4.908L7.741 8.88a.45.45 0 0 1-.482 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  联系我
                </a>
              </div>
              <div className="joan-button-shell">
                <a className="button button-secondary" href="/about">
                  <svg
                    className="button-icon"
                    viewBox="0 0 15 15"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M7.5.875a3.625 3.625 0 0 0-1.006 7.109c-1.194.145-2.218.567-2.99 1.328-.982.967-1.479 2.408-1.479 4.288a.475.475 0 1 0 .95 0c0-1.72.453-2.88 1.196-3.612.744-.733 1.856-1.113 3.329-1.113s2.585.38 3.33 1.113c.742.733 1.195 1.892 1.195 3.612a.475.475 0 1 0 .95 0c0-1.88-.497-3.32-1.48-4.288-.77-.76-1.795-1.183-2.989-1.328A3.627 3.627 0 0 0 7.5.875M4.825 4.5a2.675 2.675 0 1 1 5.35 0 2.675 2.675 0 0 1-5.35 0"
                      clipRule="evenodd"
                    />
                  </svg>
                  关于我
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="stat-grid" aria-label="个人数据概览">
          <article>
            <strong>10w+</strong>
            <span>原创内容总阅读</span>
          </article>
          <article>
            <strong>32</strong>
            <span>篇原创文章与贴图</span>
          </article>
          <article>
            <strong>5k+</strong>
            <span>视频播放</span>
          </article>
          <article>
            <strong>300+</strong>
            <span>视频点赞</span>
          </article>
        </section>

        <section className="section experience-section" id="experience">
          <div className="experience-heading">
            <div className="section-title-card">
              <div className="section-title-card-surface">
                <h2>个人经历</h2>
              </div>
            </div>
          </div>

          <div className="experience-cards" aria-label="个人经历">
            {experiences.map((experience) => (
              <article className="experience-card" key={experience.title}>
                <div className="experience-card-grid">
                  <div className="experience-summary">
                    <span className="experience-dot" aria-hidden="true">•</span>
                    <h3>{experience.title}</h3>
                    <h4>{experience.role}</h4>
                    <time>{experience.period}</time>
                  </div>
                  <div className="experience-detail">
                    <p>{experience.description}</p>
                    {experience.details && <p>{experience.details}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section content-section" id="articles" aria-labelledby="articles-title">
          <div className="section-heading content-heading">
            <div className="section-title-card">
              <div className="section-title-card-surface">
                <h2 id="articles-title">文章</h2>
              </div>
            </div>
            <a className="section-link-button section-link-button--articles" href="/articles">
              所有文章
              <svg className="section-link-chevron" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m3.5 5.5 6.5 6.5-6.5 6.5M11.5 5.5 18 12l-6.5 6.5" />
              </svg>
            </a>
          </div>

          <ArticleGrid />
        </section>

        <section className="section content-section video-section" id="videos" aria-labelledby="videos-title">
          <div className="section-heading content-heading">
            <div className="section-title-card">
              <div className="section-title-card-surface">
                <h2 id="videos-title">视频</h2>
              </div>
            </div>
            <a className="section-link-button section-link-button--articles" href="/videos">
              所有视频
              <svg className="section-link-chevron" aria-hidden="true" viewBox="0 0 24 24">
                <path d="m3.5 5.5 6.5 6.5-6.5 6.5M11.5 5.5 18 12l-6.5 6.5" />
              </svg>
            </a>
          </div>

          <VideoGrid showPlaceholder />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
