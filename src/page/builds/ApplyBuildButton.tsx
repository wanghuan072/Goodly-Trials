"use client";

import { useRouter } from "next/navigation";
import { BUILDER_PRESET_KEY } from "@/lib/builder/plan-state";
import { builderStateFromBuild } from "@/lib/builder/presets";
import type { Build } from "@/types/build";
import styles from "@/style/page/builds/builds.module.css";

export default function ApplyBuildButton({ build }: { build: Build }) {
  const router = useRouter();

  function applyBuild() {
    window.localStorage.setItem(BUILDER_PRESET_KEY, JSON.stringify(builderStateFromBuild(build)));
    router.push("/builder");
  }

  return <button className={styles.applyButton} type="button" onClick={applyBuild}>Use in Builder <span>→</span></button>;
}
