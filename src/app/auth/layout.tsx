import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirish / Ro'yxatdan o'tish",
  description: "Makon platformasiga kiring yoki ro'yxatdan o'ting — e'lon joylashtirish va sevimlilarni saqlash uchun.",
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
