import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import EntityLinks from "@/components/content/EntityLinks";
import HeroIntel from "@/components/content/HeroIntel";
import JsonLd from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import type { Guide } from "@/types/content";
import styles from "@/style/page/archive/archive.module.css";

type GuideDetail = {
  quickAnswer: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  media?: {
    afterSection: number;
    src: string;
    alt: string;
    caption: string;
  }[];
};

export default function GuideDetailPage({
  guide,
  detail,
}: {
  guide: Guide;
  detail: GuideDetail;
}) {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.excerpt,
          dateModified: guide.updated,
          author: { "@type": "Organization", name: siteConfig.name },
          mainEntityOfPage: `${siteConfig.url}/guides/${guide.slug}`,
        }}
      />
      <section
        className={styles.hero}
        style={{ "--hero-image": `url("${detail.media?.[0]?.src ?? "/images/game/screenshot-7.webp"}")` } as CSSProperties}
      >
        <div className={`container ${styles.heroContent}`}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: guide.title },
            ]}
          />
          <p className={styles.eyebrow}>{guide.category} · Player guide</p>
          <h1>{guide.title}</h1>
          <p>{guide.excerpt}</p>
          <HeroIntel eyebrow="Field notes" title="Use this guide" items={[{ value: detail.sections.length, label: "Sections" }, { value: "Read", label: "Understand" }, { value: "Plan", label: "Adapt" }, { value: "Play", label: "Test" }]} />
        </div>
      </section>
      <section className={`container section ${styles.contentGrid}`}>
        <article className={`${styles.mainColumn} ${styles.prose}`}>
          <div className={styles.quickAnswer}>
            <b>Start here</b>
            <p>
              <EntityLinks currentHref={`/guides/${guide.slug}`}>
                {detail.quickAnswer}
              </EntityLinks>
            </p>
          </div>
          {detail.sections.map((section, index) => (
            <div key={section.title}>
              <section id={`section-${index + 1}`}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <EntityLinks currentHref={`/guides/${guide.slug}`}>
                      {paragraph}
                    </EntityLinks>
                  </p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>
                        <EntityLinks currentHref={`/guides/${guide.slug}`}>
                          {item}
                        </EntityLinks>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              {detail.media
                ?.filter((media) => media.afterSection === index + 1)
                .map((media) => (
                  <figure className={styles.guideFigure} key={media.src}>
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={1920}
                      height={1080}
                      sizes="(max-width: 1024px) 100vw, 820px"
                    />
                    <figcaption>{media.caption}</figcaption>
                  </figure>
                ))}
            </div>
          ))}
        </article>
        <aside className={styles.sidebar}>
          <h2>On this page</h2>
          {detail.sections.map((section, index) => (
            <a key={section.title} href={`#section-${index + 1}`}>
              {section.title}
            </a>
          ))}
          <h3>Keep exploring</h3>
          <Link href="/wiki/units">Units</Link>
          <Link href="/wiki/gear">Gear</Link>
          <Link href="/guides">All gameplay guides</Link>
          <Link href="/updates">Updates</Link>
          <h3>Official game links</h3>
          <a
            href="https://goodlytrials.com/wiki"
            target="_blank"
            rel="noreferrer"
          >
            Official mechanics ↗
          </a>
          <a
            href="https://goodlytrials.com/wiki/modes"
            target="_blank"
            rel="noreferrer"
          >
            Official modes ↗
          </a>
        </aside>
      </section>
    </main>
  );
}
