import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shaxsiy kabinet",
  description: "O'z e'lonlarini boshqarish va profil ma'lumotlarini ko'rish.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
