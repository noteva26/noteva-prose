import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { getNoteva } from "@/hooks/useNoteva";

interface ResolvedCategory {
  id: string;
  label: string;
  icon: string;
  emojis: Record<string, string>;
}

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<ResolvedCategory[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load categories from SDK when picker opens
  useEffect(() => {
    if (!open) return;
    const load = () => {
      const N = getNoteva();
      if (N?.emoji) {
        setCategories(N.emoji.getCategories());
      } else {
        setTimeout(load, 50);
      }
    };
    load();
  }, [open]);

  // Click outside to close
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // Parse Twemoji via SDK
  useEffect(() => {
    if (!open) return;
    const N = getNoteva();
    if (gridRef.current && N?.emoji) {
      N.emoji.parse(gridRef.current, { attributes: () => ({ style: "width:22px;height:22px" }) });
    }
  }, [open, activeCategory, search]);

  useEffect(() => {
    if (!open) return;
    const N = getNoteva();
    if (sidebarRef.current && N?.emoji) {
      N.emoji.parse(sidebarRef.current, { attributes: () => ({ style: "width:20px;height:20px" }) });
    }
  }, [open]);

  // Search results
  const searchResults = useMemo(() => {
    if (!search.trim() || categories.length === 0) return null;
    const q = search.toLowerCase();
    const results: { code: string; emoji: string }[] = [];
    for (const cat of categories) {
      for (const [code, emoji] of Object.entries(cat.emojis)) {
        if (code.includes(q)) results.push({ code, emoji });
        if (results.length >= 80) break;
      }
      if (results.length >= 80) break;
    }
    return results;
  }, [search, categories]);

  const handleCategoryClick = useCallback((idx: number) => {
    setSearch("");
    setActiveCategory(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleScroll = useCallback(() => {
    if (search || !gridRef.current) return;
    const top = gridRef.current.scrollTop;
    for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[i];
      if (el && el.offsetTop - gridRef.current.offsetTop <= top + 8) {
        setActiveCategory(i);
        break;
      }
    }
  }, [search]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 text-secondary-foreground hover:text-primary transition-colors rounded"
        title="Emoji"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 bottom-full mb-2 right-0 flex flex-col w-[340px] h-[280px] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {categories.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-secondary-foreground">Loading...</div>
          ) : (
            <>
              {/* Search */}
              <div className="px-2 pt-2 pb-1">
                <input
                  type="text"
                  placeholder="🔍"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Category sidebar */}
                <div ref={sidebarRef} className="flex flex-col w-10 border-r border-border py-1 gap-0.5 items-center overflow-y-auto">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(idx)}
                      title={cat.label}
                      className={`w-8 h-8 flex items-center justify-center rounded text-base hover:bg-secondary transition-colors ${
                        activeCategory === idx && !search ? "bg-secondary ring-1 ring-primary/30" : ""
                      }`}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>

                {/* Emoji grid */}
                <div ref={gridRef} className="flex-1 overflow-y-auto px-2 py-1" onScroll={handleScroll}>
                  {searchResults ? (
                    <>
                      <div className="grid grid-cols-8 gap-1">
                        {searchResults.map(({ code, emoji }) => (
                          <button key={code} onClick={() => { onSelect(emoji); setOpen(false); }}
                            title={`:${code}:`}
                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded-md cursor-pointer transition-colors">
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 0 && (
                        <div className="text-sm text-secondary-foreground text-center py-8">😶</div>
                      )}
                    </>
                  ) : (
                    categories.map((cat, idx) => (
                      <div key={cat.id} ref={(el) => { sectionRefs.current[idx] = el; }}>
                        <div className="text-xs text-secondary-foreground sticky top-0 bg-card py-1 px-1 font-medium">
                          {cat.label}
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {Object.entries(cat.emojis).map(([code, emoji]) => (
                            <button key={code} onClick={() => { onSelect(emoji); setOpen(false); }}
                              title={`:${code}:`}
                              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary rounded-md cursor-pointer transition-colors">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
