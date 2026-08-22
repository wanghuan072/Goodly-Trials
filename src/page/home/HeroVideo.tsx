"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/style/page/home/home.module.css";

const videoId = "AaNC3dp4Sck";
const videoTitle = "Goodly Trials Gameplay Trailer (2026)";

export default function HeroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className={styles.heroVideo} aria-label="Official Goodly Trials trailer">
      {isPlaying ? (
        <iframe
          className={styles.videoFrame}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          className={styles.videoPoster}
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${videoTitle}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            priority
          />
          <span className={styles.videoVeil} aria-hidden="true" />
          <span className={styles.videoPlay} aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path d="M18 13.5 35 24 18 34.5z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.videoMeta}>
            <span>Official gameplay trailer</span>
            <small>Play video</small>
          </span>
        </button>
      )}
    </section>
  );
}
