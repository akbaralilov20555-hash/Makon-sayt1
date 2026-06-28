import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yangi e'lon qo'shish — Makon",
  description: "Kvartira, uy yoki tijorat mulkingizni bir necha daqiqada e'lon qiling — bepul va tezkor.",
};

export default function NewListingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
