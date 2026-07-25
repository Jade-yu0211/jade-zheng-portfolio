import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";
import VideoGrid from "../video-grid";

export default function VideosPage() {
  return (
    <main id="videos-page">
      <SiteHeader activePage="videos" />

      <div className="page-shell videos-page-shell">
        <section className="section videos-index-section" aria-labelledby="all-videos-title">
          <header className="articles-page-hero videos-page-hero">
            <div className="articles-title-stack">
              <div className="articles-title-panel">
                <h1 id="all-videos-title">视频</h1>
              </div>
            </div>

            <div className="articles-page-intro">
              <h2>鲫鱼书舍</h2>
              <p className="articles-page-details">
                目前已形成 <strong>1</strong> 个视频合集，累计发表{" "}
                <strong>1</strong> 个视频
                <br />
                账号总播放量 <strong>5k+</strong>，获赞{" "}
                <strong>300+</strong>
              </p>
            </div>
          </header>

          <VideoGrid showPlaceholder />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
