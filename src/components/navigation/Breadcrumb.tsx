import Link from "next/link";
import JsonLd from "@/seo/JsonLd";
import { siteConfig } from "@/config/site";
import styles from "@/style/navigation/breadcrumb.module.css";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}) })),
      }} />
    </>
  );
}
