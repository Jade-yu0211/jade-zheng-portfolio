const douyinVideo = "https://www.douyin.com/video/7664423993398562067";

type VideoGridProps = {
  showPlaceholder?: boolean;
};

export default function VideoGrid({ showPlaceholder = false }: VideoGridProps) {
  return (
    <div className="article-grid video-grid">
      <a
        className="article-card video-article-card"
        href={douyinVideo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="前往抖音观看《23本小说从夯到拉排名》"
      >
        <div className="article-cover video-cover">
          <img src="/video-cover-01.png" alt="23本小说从夯到拉排名视频封面" />
        </div>
        <div className="article-card-body">
          <div className="content-card-meta">
            <span className="article-category">抖音视频</span>
            <time>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6.5 3.5v3M17.5 3.5v3M4.5 8.5h15M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" />
              </svg>
              2026-07-20
            </time>
          </div>
          <h3>23本小说从夯到拉排名</h3>
          <p className="article-description">年度锐评</p>
          <div
            className="content-card-footer"
            aria-label="播放量 5k+，点赞量 300+"
          >
            <span className="article-metric">
              <svg className="metric-icon metric-eye" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.75" />
              </svg>
              <b>5k+</b>
            </span>
            <span className="article-metric">
              <svg className="metric-icon metric-heart" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              <b>300+</b>
            </span>
          </div>
        </div>
      </a>

      {showPlaceholder ? (
        <article className="article-card video-article-card video-coming-card">
          <div className="article-card-body video-coming-body">
            <h3>更多视频正在录制中</h3>
            <p className="article-description">敬请期待~</p>
          </div>
        </article>
      ) : null}
    </div>
  );
}
