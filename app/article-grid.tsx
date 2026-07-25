"use client";

import { useState } from "react";

const articles = [
  {
    index: "01",
    href: "https://mp.weixin.qq.com/s/c51um4fRaxwbQll3h0Azpw",
    cover: "/article-cover-01.jpg",
    coverAlt: "炒花甲和小香葱炒鸡蛋",
    category: "下得厨房",
    date: "2025-08-01",
    title: "开饭！",
    description: "炒花甲和小香葱炒鸡蛋",
    views: "5.2w+",
    likes: "112",
    featured: true,
  },
  {
    index: "02",
    href: "https://mp.weixin.qq.com/s/zjvGITvzUYdeB-zPcVOc7A",
    cover: "/article-cover-02.jpg",
    coverAlt: "夕阳下叼着花的白色小狗",
    category: "奇思妙想",
    date: "2025-12-11",
    title: "“我喜欢你”&“我爱你”",
    description: "什么是喜欢？什么是爱？",
    views: "9.5k+",
    likes: "43",
    featured: true,
  },
  {
    index: "03",
    href: "https://mp.weixin.qq.com/s/49vz4fBdf9TfLVoS6uBT2A",
    cover: "/article-cover-03.jpg",
    coverAlt: "秋日银杏树下长椅上的朋友",
    category: "池鱼观澜",
    date: "2025-11-25",
    title: "致我的朋友",
    description: "我想对你说的只是：我好想你",
    views: "97",
    likes: "11",
    featured: true,
  },
  {
    index: "04",
    href: "https://mp.weixin.qq.com/s/2fdfCdUhw3nsPXeiJhCgVQ",
    cover: "/article-cover-04.jpg",
    coverAlt: "辣椒炒肉",
    category: "下得厨房",
    date: "2025-08-29",
    title: "开饭！",
    description: "辣椒炒肉，我最喜欢做的一道菜！",
  },
  {
    index: "05",
    href: "https://mp.weixin.qq.com/s/zTtMAHC4AFl33CgeAIstSQ",
    cover: "/article-cover-05.jpg",
    coverAlt: "小炒肉、老干妈花甲和青椒炒腊肠",
    category: "下得厨房",
    date: "2025-08-20",
    title: "开饭！",
    description: "小炒肉、老干妈花甲和青椒炒腊肠",
  },
  {
    index: "06",
    href: "https://mp.weixin.qq.com/s/0aFPj92PR0SLWiuppLYdug",
    cover: "/article-cover-06.jpg",
    coverAlt: "青椒腊肉、面煎豆角和可乐鸡翅",
    category: "下得厨房",
    date: "2025-08-19",
    title: "开饭！",
    description: "青椒腊肉、面煎豆角和可乐鸡翅",
  },
  {
    index: "07",
    href: "https://mp.weixin.qq.com/s/MDP7dASYsTnwpXzEtBe-cg",
    cover: "/article-cover-07.png",
    coverAlt: "毛豆排骨",
    category: "下得厨房",
    date: "2025-07-30",
    title: "新系列【下得厨房】",
    description: "那些自己下厨的日子总是在记忆里闪闪发光",
  },
  {
    index: "08",
    href: "https://mp.weixin.qq.com/s/gwr0Dt9aA9OXG-vtsDzqhQ",
    cover: "/article-cover-08.png",
    coverAlt: "《乡土重建》书籍封面",
    category: "雪泥鸿影",
    date: "2025-08-18",
    title: "从农业文化看中国“机器换人”",
    description: "中国传统农业里由于劳力的富余导致“人多事少”，劳力价值降低",
  },
  {
    index: "09",
    href: "https://mp.weixin.qq.com/s/LPRLgDxUgLNhBwS3MWWYXw",
    cover: "/article-cover-09.png",
    coverAlt: "《江村经济》书籍封面",
    category: "雪泥鸿影",
    date: "2025-08-08",
    title: "江村经济",
    description: "一个崭新的中国将出现在这个废墟之上",
  },
  {
    index: "10",
    href: "https://mp.weixin.qq.com/s/eWAClT5Unef00Kh7hPd6bg",
    cover: "/article-cover-10.png",
    coverAlt: "路遥《人生》书籍封面",
    category: "雪泥鸿影",
    date: "2025-07-27",
    title: "简评《人生》",
    description: "农村凤凰男高加林攀高枝不成不幸跌落",
  },
  {
    index: "11",
    href: "https://mp.weixin.qq.com/s/J6tY2Wu0TGFQQ59ruNSJKA",
    cover: "/article-cover-11.png",
    coverAlt: "暮色下在田间散步的人",
    category: "止痛药",
    date: "2025-08-02",
    title: "我在散步时特别想你",
    description: "我们在暮色四合之前，牵着手沿原路返回",
  },
  {
    index: "12",
    href: "https://mp.weixin.qq.com/s/vqTbnRSc4PB1RrYpQVZQrw",
    cover: "/article-cover-12.png",
    coverAlt: "2026年5月、6月书单封面",
    category: "池鱼观澜",
    date: "2026-07-11",
    title: "2026年5月、6月书单",
    description: "在数字化全景监狱中，我们是囚犯，是受害者，也是作案人",
  },
  {
    index: "13",
    href: "https://mp.weixin.qq.com/s/9-V4mspuP0-rwC7q9AIrbA",
    cover: "/article-cover-13.png",
    coverAlt: "2026年3月、4月书单封面",
    category: "池鱼观澜",
    date: "2026-05-18",
    title: "2026年3月、4月书单",
    description: "由于模糊了“他者”的界限而无法获得奖赏，自恋主体只能在倦怠中毁灭",
  },
  {
    index: "14",
    href: "https://mp.weixin.qq.com/s/unSZMjApviHEqwyq2DbNWg",
    cover: "/article-cover-14.png",
    coverAlt: "2025年12月与2026年1月、2月书单封面",
    category: "池鱼观澜",
    date: "2026-03-09",
    title: "2025年12月&2026年1月、2月书单",
    description: "世上的人遍地都是，说的着的人千里难寻",
  },
  {
    index: "15",
    href: "https://mp.weixin.qq.com/s/ZVZ-D7SgO3gn1umieUUkrQ",
    cover: "/article-cover-15.png",
    coverAlt: "2025年11月书单封面",
    category: "池鱼观澜",
    date: "2025-11-27",
    title: "2025年11月书单",
    description: "《毛泽东选集》真的是好书",
  },
  {
    index: "16",
    href: "https://mp.weixin.qq.com/s/dt0A40ap28Ir1s4P4zEWOg",
    cover: "/article-cover-16.jpg",
    coverAlt: "《西西弗神话》封面",
    category: "池鱼观澜",
    date: "2025-11-07",
    title: "身披焰衣 心沉冰海",
    description: "献一篇随笔告慰加缪不灭的荒诞灵魂",
  },
  {
    index: "17",
    href: "https://mp.weixin.qq.com/s/oqjyXsPkcb4G_tvjjLBbXg",
    cover: "/article-cover-17.jpg",
    coverAlt: "2025年10月书单封面",
    category: "池鱼观澜",
    date: "2025-11-03",
    title: "2025年10月书单",
    description: "当所有事情都以娱乐的形式出现，那么不会再有娱乐以外的事情",
  },
  {
    index: "18",
    href: "https://mp.weixin.qq.com/s/wGwCdiehmwpMbm7vpnpqcg",
    cover: "/article-cover-18.jpg",
    coverAlt: "2025年9月书单封面",
    category: "池鱼观澜",
    date: "2025-10-04",
    title: "2025年9月书单",
    description: "这些微小的、纸一样薄的爱正是我们活着的理由和意义",
  },
  {
    index: "19",
    href: "https://mp.weixin.qq.com/s/8sAYubL7vmQNKIP-rn97Wg",
    cover: "/article-cover-19.jpg",
    coverAlt: "莫言《蛙》书籍封面",
    category: "池鱼观澜",
    date: "2025-09-13",
    title: "《蛙》——天性压抑与信仰失守",
    description: "像洪水一样被压制的天性，宣泄的方式只有决堤。",
  },
  {
    index: "20",
    href: "https://mp.weixin.qq.com/s/1QC8W7_TsbZvgHNxUC8lEA",
    cover: "/article-cover-20.jpg",
    coverAlt: "墙边晒太阳的猫",
    category: "池鱼观澜",
    date: "2025-07-25",
    title: "凭我是你爹",
    description: "当长老统治遇上Z世代——从乡土中国看当代父子冲突",
  },
  {
    index: "21",
    href: "https://mp.weixin.qq.com/s/PrU69Eyi9W3Lnv0eYhMXuA",
    cover: "/article-cover-21.jpg",
    coverAlt: "校园楼梯上的毕业生",
    category: "鲫鱼池中二三事",
    date: "2026-07-03",
    title: "鲫鱼池中二三事",
    description: "满地垃圾是这些毕业生留给母校最后的“毕业礼物”",
  },
  {
    index: "22",
    href: "https://mp.weixin.qq.com/s/i1T9PEOZe3cYrDDFu1KL4w",
    cover: "/article-cover-22.png",
    coverAlt: "校园水池与绿树",
    category: "鲫鱼池中二三事",
    date: "2026-05-25",
    title: "鲫鱼池中二三事",
    description: "泣血哀鸣不过是石子投湖，顷刻平静。",
  },
  {
    index: "23",
    href: "https://mp.weixin.qq.com/s/VZayVpI_SARHqYd6TmGGPQ",
    cover: "/article-cover-23.jpg",
    coverAlt: "草地上并肩躺着的朋友",
    category: "止痛药",
    date: "2026-05-26",
    title: "离职二三事",
    description: "对一个人很了解时，就很难非常讨厌他",
  },
  {
    index: "24",
    href: "https://mp.weixin.qq.com/s/5ynPj0aGU-YtBld7EZrxXw",
    cover: "/article-cover-24.jpg",
    coverAlt: "火车站台上的告别",
    category: "止痛药",
    date: "2025-12-14",
    title: "从此三更无夜话，却见田圃发新芽",
    description: "这些个影影绰绰的蓝色清晨和寂寂无声的黑夜，多么叫人难捱",
  },
  {
    index: "25",
    href: "https://mp.weixin.qq.com/s/BoqawQTxN7njnn5zuA-KGA",
    cover: "/article-cover-25.png",
    coverAlt: "卡夫卡《谈话录》书籍封面",
    category: "止痛药",
    date: "2025-11-11",
    title: "真我与社会角色的割裂、艺术的震撼人心之处",
    description: "每种抵御都是后退，都是躲藏",
  },
  {
    index: "26",
    href: "https://mp.weixin.qq.com/s/hLig2PlNRRrOasSUGrc_pA",
    cover: "/article-cover-25.png",
    coverAlt: "卡夫卡《谈话录》书籍封面",
    category: "止痛药",
    date: "2025-11-10",
    title: "关于现代人的超我、书与生活",
    description: "人们害怕自由和责任，因此人们宁可在自己做的铁栅栏里窒息而死",
  },
  {
    index: "27",
    href: "https://mp.weixin.qq.com/s/aFjIpTceMsOKdIEgYVHNlA",
    cover: "/article-cover-26.jpg",
    coverAlt: "阳光下的屋顶与绿植",
    category: "止痛药",
    date: "2025-08-31",
    title: "二十岁、屋顶、时间",
    description: "我要做你的眼睛，带着疑惑去凝视、探索，轻轻地为你描绘我的见闻",
  },
  {
    index: "28",
    href: "https://mp.weixin.qq.com/s/G1nIqS6D1n0rxGKUwGNPzw",
    cover: "/article-cover-27.jpg",
    coverAlt: "夕阳下叼着花的白色小狗",
    category: "奇思妙想",
    date: "2026-01-09",
    title: "“你不会是恋爱脑吧”&“你不怕变小丑吗”",
    description: "捧着一颗真心来，不带半分遗憾去",
  },
  {
    index: "29",
    href: "https://mp.weixin.qq.com/s/vByZI2ZZFR1Jo12VCLNGSQ",
    cover: "/article-cover-28.jpg",
    coverAlt: "川菜盘中的鱼",
    category: "蜀地研究",
    date: "2025-12-24",
    title: "《蜀地研究》第1期——川人饮食观察",
    description: "蜀地不试北菜，我们北方菜不是这样的！！！",
  },
];

type ArticleGridProps = {
  variant?: "home" | "index";
};

const articleCategories = [
  "所有文章",
  "池鱼观澜",
  "鲫鱼池中二三事",
  "止痛药",
  "奇思妙想",
  "蜀地研究",
  "下得厨房",
  "雪泥鸿影",
] as const;

export default function ArticleGrid({ variant = "home" }: ArticleGridProps) {
  const isIndex = variant === "index";
  const [activeCategory, setActiveCategory] =
    useState<(typeof articleCategories)[number]>("所有文章");
  const [showAllArticles, setShowAllArticles] = useState(false);
  const indexArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const visibleArticles = isIndex
    ? activeCategory === "所有文章"
      ? indexArticles
      : indexArticles.filter((article) => article.category === activeCategory)
    : articles.filter((article) => article.featured);
  const displayedArticles =
    isIndex && !showAllArticles ? visibleArticles.slice(0, 5) : visibleArticles;

  const articleCards = (
    <div className={`article-grid${isIndex ? " article-grid--index" : ""}`}>
      {displayedArticles.map((article) => {
        const titleClass =
          article.title.length > 18
            ? " article-card--very-long-title"
            : article.title.length > 12
              ? " article-card--long-title"
              : "";
        const featuredTitleClass =
          !isIndex && article.index === "02"
            ? " article-card--featured-long-title"
            : "";
        const card = (
          <a
            className={`article-card${titleClass}${featuredTitleClass}`}
            href={article.href}
            key={article.index}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`前往微信公众号阅读《${article.title}》`}
          >
            <div className="article-cover">
              <img src={article.cover} alt={article.coverAlt} />
            </div>
            <div className="article-card-body">
              <div className="content-card-meta">
                <span className="article-category">{article.category}</span>
                <time>
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M6.5 3.5v3M17.5 3.5v3M4.5 8.5h15M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" />
                  </svg>
                  {article.date}
                </time>
              </div>
              <h3>{article.title}</h3>
              <p className="article-description">{article.description}</p>
              {isIndex ? (
                <span className="article-card-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h13M13 7l5 5-5 5" />
                  </svg>
                </span>
              ) : article.views && article.likes ? (
                <div
                  className="content-card-footer"
                  aria-label={`阅读量 ${article.views}，点赞量 ${article.likes}`}
                >
                  <span className="article-metric">
                    <svg className="metric-icon metric-eye" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="2.75" />
                    </svg>
                    <b>{article.views}</b>
                  </span>
                  <span className="article-metric">
                    <svg className="metric-icon metric-heart" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                    <b>{article.likes}</b>
                  </span>
                </div>
              ) : null}
            </div>
          </a>
        );

        return isIndex ? (
          <div
            className="article-card-frame"
            id={`article-${article.index}`}
            key={`${activeCategory}-${article.index}`}
          >
            {card}
          </div>
        ) : (
          card
        );
      })}
    </div>
  );

  if (!isIndex) {
    return articleCards;
  }

  return (
    <>
      <nav className="articles-topic-strip" aria-label="文章分类">
        <div className="articles-filter-buttons">
          {articleCategories.map((category) => (
            <button
              className={`articles-filter-card${
                activeCategory === category ? " is-active" : ""
              }`}
              type="button"
              key={category}
              aria-pressed={activeCategory === category}
              onClick={() => {
                setActiveCategory(category);
                setShowAllArticles(false);
              }}
            >
              <span className="articles-filter-mark" aria-hidden="true">
                {category === "所有文章" ? "▦" : "◇"}
              </span>
              {category}
            </button>
          ))}
        </div>
      </nav>

      {articleCards}

      {!showAllArticles && visibleArticles.length > 5 ? (
        <div className="articles-load-more-wrap">
          <button
            className="articles-load-more"
            type="button"
            aria-expanded="false"
            onClick={() => setShowAllArticles(true)}
          >
            更多文章
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m7 9 5 5 5-5" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
