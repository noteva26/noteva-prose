import { useArticles, useCategories, useSiteInfo, getArticleUrl } from "@/hooks/useNoteva";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RightSidebar from "@/components/RightSidebar";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";

// 打字机效果
function useTypewriter(texts: string[], speed = 100, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[index % texts.length];

    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplay(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setIndex(index + 1);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, index, texts, speed, pause]);

  return display;
}

export default function HomePage() {
  const { info } = useSiteInfo();
  const { articles, loading } = useArticles({ page: 1, pageSize: 100 });
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const subtitle = useTypewriter(
    info?.subtitle ? [info.subtitle] : ["记录生活，分享技术"],
    80,
    3000
  );

  // 置顶文章
  const pinnedArticles = articles.filter((a: any) => a.is_pinned || a.isPinned);
  // 普通文章
  const normalArticles = searchQuery
    ? articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.tags?.some((tag: any) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles.filter((a: any) => !a.is_pinned && !a.isPinned).slice(0, 10);

  // 分类颜色
  const categoryColors = [
    "from-[#358bff] to-[#15c6ff]",
    "from-[#f65] to-[#ffbf37]",
    "from-[#18e7ae] to-[#1eebeb]",
    "from-[#a855f7] to-[#ec4899]",
    "from-[#f97316] to-[#eab308]",
    "from-[#06b6d4] to-[#3b82f6]",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero 区域 */}
      {!searchQuery && (
        <section className="hero-section relative pt-16 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"></div>
            <div className="absolute -bottom-[30%] -left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent/15 to-transparent blur-3xl"></div>
          </div>

          <div className="relative max-w-[1600px] mx-auto px-4 pt-12 pb-8">
            <div className="flex gap-6 items-stretch">
              {/* 左侧 Banner */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* 主 Banner */}
                <div className="hero-banner flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#667eea] via-[#5b72ff] to-[#764ba2] p-8 lg:p-10 flex flex-col justify-between min-h-[280px]">
                  {/* 装饰圆 */}
                  <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-sm"></div>
                  <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-white/5"></div>

                  <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 animate-fade-in-up">
                      {info?.name || "Noteva"}
                    </h1>
                    <div className="text-white/80 text-lg lg:text-xl min-h-[2em]">
                      {subtitle}<span className="animate-blink">|</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 mt-6">
                    <a
                      href="/archives"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition-all hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      文章归档
                    </a>
                  </div>
                </div>

                {/* 分类快捷入口 */}
                {categories.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {categories.slice(0, 4).map((cat: any, i: number) => (
                      <a
                        key={cat.id}
                        href={`/${cat.slug}`}
                        className={`category-btn flex-1 relative overflow-hidden rounded-xl p-3 lg:p-4 text-white font-bold bg-gradient-to-r ${categoryColors[i % categoryColors.length]} transition-all hover:flex-[1.5] group`}
                      >
                        <span className="relative z-10 text-sm lg:text-base">{cat.name}</span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl lg:text-4xl opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 font-bold">
                          {cat.count || cat.article_count || 0}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* 右侧置顶文章 */}
              <div className="hidden lg:flex flex-col gap-3 w-[340px] xl:w-[380px] flex-shrink-0">
                {pinnedArticles.length > 0 ? (
                  pinnedArticles.slice(0, 3).map((article: any, i: number) => (
                    <a
                      key={article.id}
                      href={getArticleUrl(article)}
                      className="pinned-card group relative flex-1 rounded-xl overflow-hidden bg-card shadow-card hover:shadow-hover transition-all"
                    >
                      {(article.cover || article.thumbnail || article.coverImage) ? (
                        <img
                          src={article.cover || article.thumbnail || article.coverImage}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[(i + 2) % categoryColors.length]}`}></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="relative z-10 h-full flex flex-col justify-end p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-primary/80 text-white rounded-full w-fit mb-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          置顶
                        </span>
                        <h3 className="text-white font-bold text-sm lg:text-base line-clamp-2 drop-shadow-lg">
                          {article.title}
                        </h3>
                      </div>
                    </a>
                  ))
                ) : (
                  // 没有置顶文章时显示最新文章
                  articles.slice(0, 3).map((article: any, i: number) => (
                    <a
                      key={article.id}
                      href={getArticleUrl(article)}
                      className="pinned-card group relative flex-1 rounded-xl overflow-hidden bg-card shadow-card hover:shadow-hover transition-all"
                    >
                      {(article.cover || article.thumbnail || article.coverImage) ? (
                        <img
                          src={article.cover || article.thumbnail || article.coverImage}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[(i + 2) % categoryColors.length]}`}></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="relative z-10 h-full flex flex-col justify-end p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-white/20 backdrop-blur-sm text-white rounded-full w-fit mb-2">
                          最新
                        </span>
                        <h3 className="text-white font-bold text-sm lg:text-base line-clamp-2 drop-shadow-lg">
                          {article.title}
                        </h3>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 主内容区 */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {/* 搜索结果提示 */}
            {searchQuery && (
              <div className="mb-8 pt-20 animate-fade-in-up">
                <h1 className="text-3xl font-bold mb-2">
                  搜索: <span className="text-primary">{searchQuery}</span>
                </h1>
                <p className="text-secondary-foreground">找到 {normalArticles.length} 篇文章</p>
              </div>
            )}

            {/* 文章列表标题 */}
            {!searchQuery && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary-light"></div>
                <h2 className="text-xl font-bold">最新文章</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
              </div>
            )}

            {/* 文章列表 */}
            <div className="space-y-5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse flex h-[200px]">
                    <div className="w-[280px] bg-secondary flex-shrink-0"></div>
                    <div className="flex-1 p-6 space-y-3">
                      <div className="h-5 bg-secondary rounded w-3/4"></div>
                      <div className="h-4 bg-secondary rounded w-1/2"></div>
                      <div className="h-16 bg-secondary rounded"></div>
                    </div>
                  </div>
                ))
              ) : normalArticles.length > 0 ? (
                normalArticles.map((article: any, index: number) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    delay={index * 60}
                    direction={index % 2 === 0 ? "left" : "right"}
                  />
                ))
              ) : (
                <div className="w-full text-center py-12 text-secondary-foreground">
                  {searchQuery ? "未找到相关文章" : "暂无文章"}
                </div>
              )}
            </div>
          </div>

          {/* 右侧边栏 */}
          <aside className="hidden lg:block w-[300px] xl:w-[340px] 2xl:w-[360px] flex-shrink-0">
            <div className="sticky top-[80px]">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
