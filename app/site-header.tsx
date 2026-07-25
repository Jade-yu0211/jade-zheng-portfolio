"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "jade-zheng-theme";

type SiteHeaderProps = {
  activePage?: "home" | "articles" | "videos" | "about";
};

type ActiveNav = "home" | "experience" | "articles" | "videos" | "about";

export default function SiteHeader({ activePage = "home" }: SiteHeaderProps) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<ActiveNav>(activePage);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  useEffect(() => {
    if (activePage !== "home") {
      setActiveNav(activePage);
      return;
    }

    const updateActiveNav = () => {
      const section = window.location.hash.slice(1);

      if (section === "experience") {
        setActiveNav(section);
      } else {
        setActiveNav("home");
      }
    };

    updateActiveNav();
    window.addEventListener("hashchange", updateActiveNav);

    return () => window.removeEventListener("hashchange", updateActiveNav);
  }, [activePage]);

  const closeMenu = () => setMenuOpen(false);
  const toggleTheme = () => {
    setDark((currentDark) => {
      const nextDark = !currentDark;
      const nextTheme = nextDark ? "dark" : "light";

      document.documentElement.dataset.theme = nextTheme;
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // The selected theme still applies for this page if storage is unavailable.
      }

      return nextDark;
    });
  };

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="返回首页">
        <img className="brand-icon header-brand-icon" src="/jade-book-icon-thick.png" alt="" />
        <span>Jade Zheng</span>
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label="打开导航"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? "site-nav is-open" : "site-nav"}>
        <a className={activeNav === "home" ? "active" : undefined} href="/" onClick={closeMenu}>
          首页
        </a>
        <a
          className={activeNav === "experience" ? "active" : undefined}
          href="/#experience"
          onClick={() => {
            setActiveNav("experience");
            closeMenu();
          }}
        >
          经历
        </a>
        <a
          className={activeNav === "articles" ? "active" : undefined}
          href="/articles"
          onClick={closeMenu}
        >
          文章
        </a>
        <a
          className={activeNav === "videos" ? "active" : undefined}
          href="/videos"
          onClick={closeMenu}
        >
          视频
        </a>
        <a
          className={activeNav === "about" ? "active" : undefined}
          href="/about"
          onClick={() => {
            setActiveNav("about");
            closeMenu();
          }}
        >
          关于我
        </a>
      </nav>

      <button
        className="theme-button"
        type="button"
        aria-label={dark ? "切换至浅色模式" : "切换至深色模式"}
        onClick={toggleTheme}
      >
        {dark ? (
          <svg className="theme-icon theme-icon-moon" aria-hidden="true" viewBox="0 0 15 15">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2.9.5a.4.4 0 0 0-.8 0v.6h-.6a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 1 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zm3 3a.4.4 0 1 0-.8 0v.6h-.6a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 1 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zm-4 3a.4.4 0 1 0-.8 0v.6H.5a.4.4 0 1 0 0 .8h.6v.6a.4.4 0 0 0 .8 0v-.6h.6a.4.4 0 0 0 0-.8h-.6zM8.544.982l-.298-.04c-.213-.024-.34.224-.217.4q.211.305.389.632A6.602 6.602 0 0 1 2.96 11.69c-.215.012-.334.264-.184.417q.103.105.21.206l.072.066.26.226.188.148.121.09.187.131.176.115q.18.115.37.217l.264.135.26.12.303.122.244.086a6.6 6.6 0 0 0 1.103.26l.317.04.267.02q.19.011.384.011a6.6 6.6 0 0 0 6.56-7.339l-.038-.277a6.6 6.6 0 0 0-.384-1.415l-.113-.268-.077-.166-.074-.148a6.6 6.6 0 0 0-.546-.883l-.153-.2-.199-.24-.163-.18-.12-.124-.16-.158-.223-.2-.32-.26-.245-.177-.292-.19-.321-.186-.328-.165-.113-.052-.24-.101-.276-.104-.252-.082-.325-.09-.265-.06zm1.86 4.318a7.6 7.6 0 0 0-.572-2.894 5.601 5.601 0 1 1-4.748 10.146 7.6 7.6 0 0 0 3.66-2.51.749.749 0 0 0 1.355-.442.75.75 0 0 0-.584-.732q.093-.174.178-.355A1.25 1.25 0 1 0 10.35 6.2q.052-.442.052-.9"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="theme-icon theme-icon-sun" aria-hidden="true" viewBox="0 0 15 15">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M7.5 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5M2.197 2.197a.5.5 0 0 1 .707 0L4.318 3.61a.5.5 0 0 1-.707.707L2.197 2.904a.5.5 0 0 1 0-.707M.5 7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm1.697 5.803a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707l-1.414 1.414a.5.5 0 0 1-.707 0M12.5 7a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm-1.818-2.682a.5.5 0 0 1 0-.707l1.414-1.414a.5.5 0 1 1 .707.707L11.39 4.318a.5.5 0 0 1-.707 0M8 12.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zm2.682-1.818a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 1 1-.707.707l-1.414-1.414a.5.5 0 0 1 0-.707M5.5 7.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </header>
  );
}
