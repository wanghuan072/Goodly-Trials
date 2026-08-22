import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/types/content";
import styles from "@/style/content/cards.module.css";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <article className={styles.itemCard}>
      <div className={styles.itemImage}>
        {item.image ? (
          <Image src={item.image} alt={`${item.name} official game icon`} width={72} height={72} unoptimized={item.image.endsWith(".gif") || item.image.startsWith("http")} />
        ) : (
          <span aria-label="Official item art has not been published">?</span>
        )}
      </div>
      <p className={styles.eyebrow}>{item.type}</p>
      <h3><Link href={`/wiki/gear/${item.slug}`}>{item.name}</Link></h3>
      <p>{item.effects.slice(0, 2).join(" · ")}</p>
      <span className={styles.cost}>{item.cost === undefined ? "Cost not published" : `${item.cost}G`}</span>
    </article>
  );
}
