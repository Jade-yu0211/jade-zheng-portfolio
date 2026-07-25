"use client";

import { useEffect, useState } from "react";

type TocItem = {
  href: string;
  label: string;
};

export default function AboutToc({ items }: { items: TocItem[] }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry?.target.id) {
          setActiveHref(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-26% 0px -62% 0px",
        threshold: 0.05,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="about-toc" aria-label="关于我页面目录">
      <h2>目录</h2>
      <nav>
        {items.map((item) => (
          <a
            className={activeHref === item.href ? "active" : undefined}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
