import AboutToc from "./about-toc";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

const contents = [
  { href: "#about-jade", label: "关于我" },
  { href: "#reading-and-writing", label: "阅读与写作" },
  { href: "#fitness", label: "健身" },
  { href: "#cooking", label: "下厨" },
  { href: "#ai-coding", label: "AI编程" },
];

export default function AboutPage() {
  return (
    <main id="about-page">
      <SiteHeader activePage="about" />

      <div className="about-page-shell">
        <div className="about-page-layout">
          <div className="about-layout-spacer" aria-hidden="true" />

          <article className="about-article">
            <header className="about-profile">
              <div className="about-profile-avatar-shell">
                <div className="about-profile-avatar-surface">
                  <img
                    src="/jade-zheng-portrait.jpg"
                    alt="Jade Zheng 的个人照片"
                  />
                </div>
              </div>

              <div className="about-profile-copy">
                <h1>Jade Zheng</h1>
                <p>
                  经济学在读研究生。读书博主，微信公众号和抖音账号「鲫鱼书舍」的创作者。
                </p>
              </div>
            </header>

            <div className="about-story">
              <section aria-labelledby="about-jade">
                <h2 id="about-jade">
                  关于<strong>我</strong>
                </h2>
                <p>
                  我在河南一个平平无奇的小村庄长大，是爷爷奶奶带大的孩子。童年最深刻的印象是农村的平房小院，
                  沿河弯弯的小路，杨树叶子在风里哗啦啦的响声，轰鸣的拖拉机和装满玉米棒子的箩筐。当然，
                  还有一群一起在村里捣蛋的小伙伴。
                </p>
                <p>
                  十一岁之后，我到市里的小学读五年级。初中也是个调皮捣蛋的孩子，爬到学校的石榴树上摘石榴，
                  因为跑得比其他人慢被副校长抓到。到了高中，第一次月考物理只有四十多分，选了文科。
                </p>
                <p>
                  直到现在，我也经常做高考噩梦。我似乎把我的大学当作高中过了，好在我有一群要好的舍友。
                  2025年，我来到成都，开始了研究生生活，养成了阅读和健身的习惯。由衷感谢康康和我錋。
                </p>
              </section>

              <section aria-labelledby="reading-and-writing">
                <h2 id="reading-and-writing">阅读与写作</h2>
                <p>
                  我从2025年7月开始系统性阅读，并在公众号「鲫鱼书舍」记录我的思考。截至目前对我影响最大的两本书是
                  加缪的《西西弗神话》和阿德勒的《自卑与超越》。关于《西西弗神话》，我写了一篇随笔
                  《身披焰衣，心沉冰海》，阐述我对荒诞哲学的理解。
                </p>
                <p>
                  最近在读的书是石黑一雄的《莫失莫忘》。
                </p>
                <p>
                  我也在努力拓展自己的阅读边界，尝试阅读英语小说《The Correspondent》。
                </p>
              </section>

              <section aria-labelledby="fitness">
                <h2 id="fitness">健身</h2>
                <p>
                  我从2025年10月开始规律健身。lsp是我的金牌教练，在他的悉心指导下，我的卧推已经能够55kg做组，
                  并且解锁了悬垂举腿和引体向上。
                </p>
                <p>
                  很开心看到自己的身体一点一点变强壮，希望明年或者后年我能够自信勇敢地站上学校健身大赛的舞台上！
                </p>
              </section>

              <section aria-labelledby="cooking">
                <h2 id="cooking">下厨</h2>
                <p>
                  本人是位大厨（自封的）。最擅长的菜品是辣椒炒肉。这主要归功于老爹的影响，此人厨艺十分了得。
                  我的公众号【下得厨房】系列记录了我做的一些菜品。可惜的是，学校里不让开灶，这个系列只有在家的时候才能更新。
                </p>
              </section>

              <section aria-labelledby="ai-coding">
                <h2 id="ai-coding">AI编程</h2>
                <p>这个个人网站是我 Vibe Coding 的第一个作品！</p>
              </section>
            </div>
          </article>

          <AboutToc items={contents} />
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
