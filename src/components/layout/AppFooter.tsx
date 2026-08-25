import Image from "next/image";
import Link from "next/link";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import styles from "@/style/layout/app-footer.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <Image src="/images/ui/goodly-trials-crest.png" alt="" width={64} height={64} aria-hidden="true" />
          <h2>Goodly Trials Wiki</h2>
          <p>A player-made companion for checking public game details, comparing a company, and planning the next Goodly Trials run.</p>
        </div>
        <div><h2>Navigate</h2>{primaryNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <div><h2>Legal</h2><Link href="/legal/privacy-policy" rel="noopener noreferrer nofollow">Privacy Policy</Link><Link href="/legal/terms-of-service" rel="noopener noreferrer nofollow">Terms of Service</Link><Link href="/legal/copyright" rel="noopener noreferrer nofollow">Copyright</Link><Link href="/legal/about-us" rel="noopener noreferrer nofollow">About Us</Link><Link href="/legal/contact-us" rel="noopener noreferrer nofollow">Contact Us</Link></div>
      </div>
      <div className={`container ${styles.bottom}`}><span>Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span><span>This is an independent fan site and is not affiliated with the official Goodly Trials website or its rights holders.</span></div>
    </footer>
  );
}
