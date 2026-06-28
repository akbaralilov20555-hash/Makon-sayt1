import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "Bizning manzilimiz, call-markaz raqami va murojaat formasi — savollaringizga tez javob beramiz.",
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
