import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E'lonlar",
  description: "Toshkent va viloyatlar bo'ylab ijaraga va sotuvga qo'yilgan minglab tekshirilgan kvartira, uy va tijorat ko'chmas mulk e'lonlari.",
};

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
