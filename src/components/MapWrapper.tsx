"use client";

import dynamic from "next/dynamic";
import { Listing } from "@/types";

const ListingsMap = dynamic(() => import("./ListingsMap").then((m) => m.ListingsMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-cream-deep animate-pulse flex items-center justify-center text-ink-soft text-sm">
      Xarita yuklanmoqda...
    </div>
  ),
});

export function MapWrapper(props: {
  listings: Listing[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}) {
  return <ListingsMap {...props} />;
}
