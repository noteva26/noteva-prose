import { useCategories, useArticles, getArticleUrl } from "@/hooks/useNoteva";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const gradients = [
  "from-[#358bff] to-[#15c6ff]",
  "from-[#f65] to-[#ffbf37]",
  "from-[#18e7ae] to-[#1eebeb]",
  "from-[#a855f7] to-[#ec4899]",
  "from-[#f97316] to-[#eab308]",
  "from-[#06b6d4] to-[#3b82f6]",
  "from-[#667eea] to-[#764ba2]",
  "from-[#f093fb] to-[#f5576c]",
];

const iconList = ["📂", "📁", "🗂️", "📋", "📑", "📚", "🏷️", "📦"];

export default function CategoriesPage() {
  const { categories, loading } = useCategories();
  const { articles } = useArticles({ page: 1, pageSize: 100 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const getCategoryArticles = (slug: string) =>
    articles.filter((a: any) => a.category?.slug === slug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Banner */}
      <div className="page-banner relative pt-16 overflow-hidden">
        <div className="category-banner relative py-20 lg:py-28">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] right-[10%] w-[100px] h-[100px] rounded-full bg-white/10 animate-float"></div>
            <div className="absolute bottom-[20%] left-[8%] w-[70px] h-[70px] rounded-full bg-white/5 animate-float" style={{ animationDelay: "1.5s" }}></div>
          </div>
          <div className="relative max-w-[900px] mx-auto px-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm mb-5 animate-fade-in-up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              分类目录
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: "80ms" }}>分类</h1>
            <p className="text-white/80 text-lg animate-fade-in-up" style={{ animationDelay: "160ms" }}>
              共 <span className="font-bold text-white text-2xl mx-1">{categories.length}</span> 个分类
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse h-36 bg-card rounded-2xl shadow-card"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((category: any, index: number) => {
                const isActive = activeCategory === category.slug;
                const count = category.count || category.article_count || 0;
                return (
                  <div
                    key={category.id}
                    onClick={() => setActiveCategory(isActive ? null : category.slug)}
                    className={`category-card group relative overflow-hidden rounded-2xl p-5 lg:p-6 text-white bg-gradient-to-br ${gradients[index % gradients.length]} shadow-card hover:shadow-hover transition-all animate-fade-in-up cursor-pointer hover:-translate-y-1 ${isActive ? "ring-4 ring-white/50 scale-[1.02]" : ""}`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="absolute top-[-20px] right-[-20px] w-[80px] h-[80px] rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-[-10px] left-[-10px] w-[50px] h-[50px] rounded-full bg-white/5"></div>
                    <div className="relative z-10">
                      <div className="text-2xl mb-2">{iconList[index % iconList.length]}</div>
                      <h2 className="text-lg font-bold mb-1">{category.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl lg:text-3xl font-extrabold opacity-90">{count}</span>
                        <span className="text-xs text-white/60">篇文章</span>
                      </div>
                      {category.description && (
                        <p className="text-xs text-white/50 mt-1.5 line-clamp-1">{category.description}</p>
                      )}
                    </div>
                    <div className={`absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 ${isActive ? "rotate-90 bg-white/40" : "group-hover:bg-white/30"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeCategory && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-primary-light"></div>
                  <h3 className="text-lg font-bold">
                    {categories.find((c: any) => c.slug === activeCategory)?.name} 下的文章
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
                </div>
                <div className="space-y-2.5">
                  {getCategoryArticles(activeCategory).map((article: any, i: number) => {
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
                            {(article.view_count ?? article.viewCount ?? 0) > 0 && (
                              <span>{article.view_count ?? article.viewCount} 阅读</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 mr-4 text-secondary-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    );
                  })}
                  {getCategoryArticles(activeCategory).length === 0 && (
                    <div className="text-center py-8 text-secondary-foreground text-sm">该分类下暂无文章</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-16 text-secondary-foreground">暂无分类</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
