import { useState } from "react";
import { useTranslation, locales } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {currentLocale?.nativeName}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-20">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                  l.code === locale ? "bg-secondary text-primary font-medium" : "text-foreground"
                }`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
