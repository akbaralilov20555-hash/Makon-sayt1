import type { Metadata } from "next";
import "./globals.css";
import { TelegramInit } from "@/components/TelegramInit";

const BASE_URL = "https://makon.uz";
const SITE_TITLE = "Makon — Har bir uy o'z makonida";
const SITE_DESCRIPTION =
  "O'zbekistondagi #1 ijara va sotuv platformasi. Toshkent va viloyatlar bo'ylab minglab tekshirilgan e'lonlar, real xarita, AI yordamchi.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Makon",
  },
  description: SITE_DESCRIPTION,
  keywords: ["uy ijarasi", "kvartira sotib olish", "Toshkent ko'chmas mulk", "ijara", "sotuv", "Makon"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: BASE_URL,
    siteName: "Makon",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="h-full antialiased">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('makon_theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <TelegramInit />
      </body>
    </html>
  );
}

