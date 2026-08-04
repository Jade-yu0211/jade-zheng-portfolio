import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";
import PersonaChatInterface from "./persona-chat-interface";

type PersonaProductPageProps = {
  slug: string;
  title: string;
  description: string;
  avatar: string;
  intro: string;
  suggestions: string[];
  pendingReply?: string;
  note: string;
  apiPath?: string;
  knowledgeStatus?: "connected" | "pending";
};

export default function PersonaProductPage({
  slug,
  title,
  description,
  avatar,
  intro,
  suggestions,
  pendingReply,
  note,
  apiPath,
  knowledgeStatus,
}: PersonaProductPageProps) {
  return (
    <main id={`${slug}-page`}>
      <SiteHeader activePage="products" />

      <div className="page-shell products-page-shell">
        <section
          className="section products-chat-section"
          aria-labelledby={`${slug}-title`}
        >
          <header className="products-page-hero">
            <div className="products-page-intro">
              <h1 id={`${slug}-title`}>{title}</h1>
              <p>{description}</p>
            </div>
          </header>

          <PersonaChatInterface
            title={title}
            avatar={avatar}
            intro={intro}
            suggestions={suggestions}
            pendingReply={pendingReply}
            note={note}
            apiPath={apiPath}
            knowledgeStatus={knowledgeStatus}
          />
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
