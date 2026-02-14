import { useState, useEffect } from "react";

export default function RightSide() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollPercent(percent);
      setShowBtn(scrollTop > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={`fixed right-4 bottom-10 z-40 flex flex-col gap-2 transition-all duration-300 ${showBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      {/* 暗色模式 */}
      <button
        onClick={toggleDarkMode}
        className="rightside-btn w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center text-secondary-foreground hover:text-primary hover:shadow-hover transition-all hover:scale-110"
        aria-label="切换主题"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      {/* 返回顶部 */}
      <button
        onClick={scrollToTop}
        className="rightside-btn w-10 h-10 rounded-full bg-primary text-white shadow-main flex items-center justify-center hover:shadow-hover transition-all hover:scale-110 relative"
        aria-label="返回顶部"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {/* 百分比 */}
        <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center">
          {scrollPercent}
        </span>
      </button>
    </div>
  );
}
