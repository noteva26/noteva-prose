import { useTags, useArticles, getArticleUrl } from "@/hooks/useNoteva";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 标签颜色 - 直接着色而非仅 hover
const tagBgColors = [
  "bg-[#358bff]/10 text-[#358bff] border-[#358bff]/20 hover:bg-[#358bff] hover:border-[#358bff]",
  "bg-[#f65]/10 text-[#f65] border-[#f65]/20 hover:bg-[#f65] hover:border-[#f65]",
  "bg-[#18e7ae]/10 text-[#18e7ae] border-[#18e7ae]/20 hover:bg-[#18e7ae] hover:border-[#18e7ae]",
  "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20 hover:bg-[#a855f7] hover:border-[#a855f7]",
  "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20 hover:bg-[#f97316] hover:border-[#f97316]",
  "bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20 hover:bg-[#06b6d4] hover:border-[#06b6d4]",
  "bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20 hover:bg-[#ec4899] hover:border-[#ec4899]",
  "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20 hover:bg-[#eab308] hover:border-[#eab308]",
];

export default function TagsPage() {
  const { tags, loading } = useTags();
  const { articles } = useArticles({ page: 1, pageSize: 100 });
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const getTagScale = (count: number) => {
    if (count >= 10) return "text-base px-5 py-2.5 font-bold";
    if (count >= 5) return "text-sm px-4 py-2 font-semibold";
    if (count >= 3) return "text-sm px-3.5 py-1.5 font-medium";
    return "text-xs px-3 py-1.5";
  };

  const getTagArticles = (slug: string) =>
    articles.filter((a: any) => a.tags?.some((t: any) => t.slug === slug));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 页面顶部 Banner */}
      <div className="page-banner relative pt-16 overflow-hidden">
        <div className="tag-banner relative py-20 lg:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[12%] w-[90px] h-[90px] rounded-full bg-white/10 animate-float"></div>
            <div className="absolute bottom-[10%] right-[15%] w-[70px] h-[70px] rounded-full bg-white/5 animate-float" style={{ animationDelay: "1.2s" }}></div>
            <div className="absolute top-[50%] right-[30%] w-[40px] h-[40px] rounded-full bg-white/8 animate-float" style={{ animationDelay: "2s" }}></div>
          </div>
          <div className="relative max-w-[900px] mx-auto px-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm mb-5 animate-fade-in-up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              标签云
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: "80ms" }}>标签</h1>
            <p className="text-white/80 text-lg animate-fade-in-up" style={{ animationDelay: "160ms" }}>
              共 <span className="font-bold text-white text-2xl mx-1">{tags.length}</span> 个标签
            </p>
          </div>
        </div>
        <svg className="relative block w-full h-[40px] -mt-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="var(--background)" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="var(--background)" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--background)"></path>
        </svg>
      </div>

      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-full h-9 w-20 shadow-sm"></div>
            ))}
          </div>
        ) : (
          <>
            {/* 标签云 */}
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-card mb-8">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {tags.map((tag: any, index: number) => {
                  const count = tag.count || tag.article_count || 0;
                  const isActive = activeTag === tag.slug;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setActiveTag(isActive ? null : tag.slug)}
                      className={`tag-pill inline-flex items-center gap-1.5 rounded-full border-2 transition-all duration-300 hover:text-white hover:scale-110 hover:shadow-lg ${getTagScale(count)} ${tagBgColors[index % tagBgColors.length]} ${isActive ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-lg" : ""} animate-fade-in-up`}
                      style={{ animationDelay: `${index * 25}ms` }}
                    >
                      <span className="opacity-60">#</span>
                      <span>{tag.name}</span>
                      {count > 0 && (
                        <span className="text-[10px] opacity-60 ml-0.5">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 选中标签的文章列表 */}
            {activeTag && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary-light"></div>
                  <h3 className="text-lg font-bold">
                    #{tags.find((t: any) => t.slug === activeTag)?.name}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>
                <div className="space-y-2.5">
                  {getTagArticles(activeTag).map((article: any, i: number) => {
                    const date = article.created_at || article.createdAt || "";
                    const cover = article.cover || article.thumbnail || article.coverImage;
                    return (
                      <a
                        key={article.id}
                        href={getArticleUrl(article)}
                        className="archive-item group flex items-center bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {cover && (
                          <div className="w-[120px] h-[70px] flex-shrink-0 overflow-hidden">
                            <img src={cover} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 px-4 py-2.5">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">{article.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-secondary-foreground">
                            <time>{new Date(date).toLocaleDateString("zh-CN")}</time>
                            {article.category && (
                              <span className="px-1.5 py-0.5 bg-secondary rounded text-[11px]">{article.category.name}</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 mr-4 text-secondary-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    );
                  })}
                  {getTagArticles(activeTag).length === 0 && (
                    <div className="text-center py-8 text-secondary-foreground text-sm">该标签下暂无文章</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && tags.length === 0 && (
          <div className="text-center py-16 text-secondary-foreground">暂无标签</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
