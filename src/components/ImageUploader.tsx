"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

export function ImageUploader({
  images,
  onChange,
  max = 8,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");

    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`Eng ko'pi bilan ${max} ta rasm yuklash mumkin`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yuklashda xatolik yuz berdi");
      } else {
        onChange([...images, ...data.urls]);
      }
    } catch {
      setError("Tarmoq xatoligi. Qayta urinib ko'ring.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((u) => u !== url));
    // Faylni serverdan ham butunlay o'chiramiz
    if (url.startsWith("/uploads/")) {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).catch(() => {
        // Server bilan bog'lanishda xatolik bo'lsa ham, rasm formadan o'chirilgan bo'ladi
      });
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-line bg-cream-deep group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="E'lon rasmi" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/70 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Rasmni o'chirish"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-1.5 text-ink-soft hover:border-terracotta/50 hover:text-terracotta transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={20} />
                <span className="text-[11px] font-medium">Rasm qo&apos;shish</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-sm text-terracotta-deep mt-2.5">{error}</p>}
      <p className="text-xs text-ink-soft/60 mt-2.5">
        JPG, PNG yoki WEBP. Har biri 8MB gacha. Eng ko&apos;pi bilan {max} ta rasm.
      </p>
    </div>
  );
}
