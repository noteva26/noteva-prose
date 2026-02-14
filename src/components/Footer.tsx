import { useSiteInfo } from "@/hooks/useNoteva";

export default function Footer() {
  const { info } = useSiteInfo();

  return (
    <footer className="relative mt-12">
      {/* 波浪分隔 */}
      <div className="w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[40px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="var(--card-bg)"></path>
        </svg>
      </div>

      <div className="bg-card border-t border-secondary/30">
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          <div className="text-center text-sm text-secondary-foreground space-y-2">
            <div>
              {info?.footer ? (
                <div dangerouslySetInnerHTML={{ __html: info.footer }} />
              ) : (
                `© ${new Date().getFullYear()} ${info?.name || "Noteva"}. All rights reserved.`
              )}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs opacity-70">
              Powered by
              <a
                href="https://github.com/noteva26/Noteva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Noteva
              </a>
              <span className="mx-1">|</span>
              Theme
              <span className="text-primary font-medium">Prose</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
