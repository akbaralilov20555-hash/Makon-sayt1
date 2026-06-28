export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const gradId = dark ? "makonLogoGradDark" : "makonLogoGradLight";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="5" y1="4" x2="29" y2="30" gradientUnits="userSpaceOnUse">
            {dark ? (
              <>
                <stop offset="0%" stopColor="#EFCB7E" />
                <stop offset="100%" stopColor="#B9883D" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#A8472A" />
                <stop offset="100%" stopColor="#C99A44" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M5 30V16C5 9.37258 10.3726 4 17 4C23.6274 4 29 9.37258 29 16V30"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M11 30V18C11 14.6863 13.6863 12 17 12C20.3137 12 23 14.6863 23 18V30"
          stroke={dark ? "#EFCB7E" : "#C99A44"}
          strokeOpacity={dark ? 0.85 : 0.8}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-display font-semibold text-[22px] tracking-tight ${dark ? "text-cream" : "text-ink"}`}>
        Makon
      </span>
    </div>
  );
}
