"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical application error:", error);
  }, [error]);

  return (
    <html lang="uz">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            background: "#FAF6EF",
            color: "#211712",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
            Nimadir xato ketdi
          </h1>
          <p style={{ color: "#4A3F37", marginBottom: "24px" }}>
            Sahifani qayta yuklab ko&apos;ring.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              background: "#C75D3A",
              color: "white",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Qayta urinish
          </button>
        </div>
      </body>
    </html>
  );
}
