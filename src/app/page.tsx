'use client';

import { useSiteConfig } from "@/context/site-config";
import ThemeRenderer from "@/components/themes/renderer";

export default function Home() {
  const { config } = useSiteConfig();
  return <ThemeRenderer config={config} />;
}
