import { useState, useEffect, useRef } from "react";
import { useSiteInfo, getNoteva } from "@/hooks/useNoteva";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItem {
  id: number;
  parent_id?: number | null;
  title?: string;
  name?: string;
  nav_type?: string;
  target?: string;
  url?: string;
  open_new_tab?: boolean;
  children?: NavItem[];
}

const BUILTIN_PATHS: Record<string, string> = {
  home: "/", archives: "/archives", categories: "/categories", tags: "/tags",
};

const BUILTIN_I18N: Record<string, string> = {
  home: "nav.home", archives: "nav.archives", categories: "nav.categories", tags: "nav.tags",
};

function getNavHref(item: NavItem): string | null {
  const url = item.target || item.url || "";
  if (item.nav_type === "builtin" && !url) return null;
  switch (item.nav_type) {
    case "builtin": return BUILTIN_PATHS[url] || "/";
    case "page": return `/${url}`;
    case "external": return url;
    default: return url || "/";
  }
}

function getNavTitleStatic(item: NavItem, t: (key: string) => string): string {
  const customTitle = item.title || item.name || "";
  if (item.nav_type === "builtin") {
    const url = item.target || item.url || "";
    const i18nKey = BUILTIN_I18N[url];
    if (i18nKey && (!customTitle || customTitle === url)) return t(i18nKey);
  }
  return customTitle;
}

// 独立组件，不会因父组件 re-render 而被重新创建
function NavDropdown({ item, t }: { item: NavItem; t: (key: string) => string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const parentHref = getNavHref(item);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative py-2 px-1 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
      >
        {getNavTitleStatic(item, t)}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-44 rounded-lg shadow-lg py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 z-50">
          {parentHref && (
            <>
              {item.nav_type === "external" ? (
                <a href={parentHref} target={item.open_new_tab ? "_blank" : "_self"} rel={item.open_new_tab ? "noopener noreferrer" : undefined} className="block px-4 py-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-200 hover:bg-primary/10 transition-colors">{getNavTitleStatic(item, t)}</a>
              ) : (
                <a href={parentHref} className="block px-4 py-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-200 hover:bg-primary/10 transition-colors">{getNavTitleStatic(item, t)}</a>
              )}
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
            </>
          )}
          {item.children!.map((child) => {
            const ch = getNavHref(child);
            if (!ch) return null;
            return child.nav_type === "external" ? (
              <a key={child.id} href={ch} target={child.open_new_tab ? "_blank" : "_self"} rel={child.open_new_tab ? "noopener noreferrer" : undefined} className="block px-4 py-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-200 hover:bg-primary/10 transition-colors">{getNavTitleStatic(child, t)}</a>
            ) : (
              <a key={child.id} href={ch} className="block px-4 py-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-200 hover:bg-primary/10 transition-colors">{getNavTitleStatic(child, t)}</a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { info } = useSiteInfo();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [nav, setNav] = useState<NavItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const load = async () => {
      const N = getNoteva();
      if (!N) { setTimeout(load, 50); return; }
      try {
        const navItems = await N.site.getNav();
        setNav((navItems || []).map(convertNav));
        const u = await N.user.check();
        setUser(u);
        setAuthChecked(true);
      } catch { setAuthChecked(true); }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const convertNav = (item: any): NavItem => ({
    id: item.id, parent_id: item.parent_id ?? null,
    title: item.title || item.name, name: item.name || item.title,
    nav_type: item.nav_type, target: item.target || item.url, url: item.url || item.target,
    open_new_tab: item.open_new_tab ?? (item.target === "_blank"),
    children: item.children?.map(convertNav),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = async () => {
    const N = getNoteva();
    if (!N) return;
    try { await N.user.logout(); setUser(null); setUserOpen(false); } catch {}
  };

  const navLinkClass = "relative py-1 hover:text-primary transition-colors bg-gradient-to-r from-primary to-primary-light bg-[length:0%_2px] bg-no-repeat bg-left-bottom hover:bg-[length:100%_2px] transition-all duration-300";

  const defaultNav = [
    { href: "/", label: t("nav.home") },
    { href: "/archives", label: t("nav.archives") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/tags", label: t("nav.tags") },
  ];

  const renderNavItems = () => {
    if (nav.length > 0) {
      return nav.filter(i => !i.parent_id).map((item) => {
        if (item.children && item.children.length > 0) {
          return <NavDropdown key={item.id} item={item} t={t} />;
        }
        const href = getNavHref(item);
        if (!href) return null;
        const isExternal = item.nav_type === "external";
        return isExternal ? (
          <a key={item.id} href={href} target={item.open_new_tab ? "_blank" : "_self"}
            rel={item.open_new_tab ? "noopener noreferrer" : undefined} className={navLinkClass}>
            {getNavTitleStatic(item, t)}
          </a>
        ) : (
          <a key={item.id} href={href} className={navLinkClass}>{getNavTitleStatic(item, t)}</a>
        );
      });
    }
    return defaultNav.map((item) => (
      <a key={item.href} href={item.href} className={navLinkClass}>{item.label}</a>
    ));
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "glass shadow-main" : "bg-transparent",
        !visible && "-translate-y-full"
      )}
    >
      <nav className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-xl gradient-text hover:scale-105 transition-transform">
          {info?.name || "Noteva"}
        </a>
        
        <div className="hidden md:flex items-center gap-6">
          {renderNavItems()}
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder={t("common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-[180px] text-sm rounded-full bg-secondary-bg border border-transparent focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </form>
          
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white transition-all hover:scale-110 hover:shadow-lg"
            aria-label={t("common.search")}
            onClick={() => {
              const html = document.documentElement;
              const currentTheme = html.getAttribute("data-theme");
              html.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {authChecked && user?.role === "admin" && (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white text-sm font-medium">
                    {(user.display_name || user.username)?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-1 z-50">
                  <a href="/manage" className="block px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    ⚙ {t("nav.manage")}
                  </a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                    ✕ {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
