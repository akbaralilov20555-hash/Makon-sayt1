import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sevimlilar",
  description: "Sizga yoqgan uy-joy e'lonlari shu yerda saqlanadi.",
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
