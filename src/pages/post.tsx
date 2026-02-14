import { useEffect, useState } from "react";
import { getNoteva } from "@/hooks/useNoteva";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Comments from "@/components/Comments";
import PluginSlot from "@/components/PluginSlot";

export default function PostPage() {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 从 URL 路径获取 slug
  const slug = window.location.pathname.replace(/^\/posts\//, '').replace(/\/$/, '');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError(true);
      return;
    }
    
    const loadArticle = async () => {
      const Noteva = getNoteva();
      if (!Noteva) {
        setTimeout(loadArticle, 50);
        return;
      }
      
      try {
        const art = await Noteva.articles.get(slug);
        setArticle(art);
      } catch (err) {
        console.error('Failed to load article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
            <div className="h-64 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">文章未找到</h1>
          <p className="text-secondary-foreground mb-6">抱歉，您访问的文章不存在或已被删除。</p>
          <a href="/" className="text-primary hover:underline">返回首页</a>
        </main>
        <Footer />
      </div>
    );
  }

  const cover = article.cover || article.thumbnail || article.coverImage;
  const categoryGradients = [
    "from-[#667eea] to-[#764ba2]",
    "from-[#358bff] to-[#15c6ff]",
    "from-[#f65] to-[#ffbf37]",
    "from-[#18e7ae] to-[#1eebeb]",
    "from-[#a855f7] to-[#ec4899]",
  ];
  const gradientIndex = article.title ? article.title.charCodeAt(0) % categoryGradients.length : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 文章顶部 Banner */}
      <div className="relative pt-16 overflow-hidden">
        <div className="relative min-h-[280px] lg:min-h-[340px] flex items-end">
          {/* 背景 */}
          {cover ? (
            <>
              <img src={cover} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[gradientIndex]}`}>
              <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-sm"></div>
              <div className="absolute bottom-[-30px] left-[-30px] w-[150px] h-[150px] rounded-full bg-white/5"></div>
            </div>
          )}

          {/* 文章信息 */}
          <div className="relative z-10 w-full max-w-[900px] mx-auto px-4 pb-10 pt-20 text-white">
            {article.category && (
              <a
                href={`/${article.category.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all mb-4 animate-fade-in-up"
              >
                {article.category.name}
              </a>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: "80ms" }}>
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {article.author.display_name || article.author.username}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {new Date(article.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {article.updated_at && article.updated_at !== article.created_at && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  更新于 {new Date(article.updated_at).toLocaleDateString("zh-CN")}
                </span>
              )}
              {article.content && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  约 {Math.ceil(article.content.length / 400)} 分钟
                </span>
              )}
            </div>
          </div>
        </div>
        {/* 波浪过渡 */}
        <svg className="relative block w-full h-[30px] -mt-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="var(--background)"></path>
        </svg>
      </div>
      
      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-8">
        <article className="animate-fade-in-up bg-card rounded-2xl p-6 lg:p-10 shadow-card">

          {/* article_content_top 插槽 */}
          <PluginSlot name="article_content_top" />
          
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content_html || article.html || article.content }}
          />
          
          {/* article_content_bottom 插槽 */}
          <PluginSlot name="article_content_bottom" />

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-secondary/30">
              <span className="text-sm text-secondary-foreground mr-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                标签:
              </span>
              {article.tags.map((tag: any) => (
                <a
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-all hover:scale-105"
                >
                  #{tag.name}
                </a>
              ))}
            </div>
          )}
        </article>

        {/* article_after_content 插槽 */}
        <PluginSlot name="article_after_content" className="my-6" />

        <Comments articleId={article.id} authorId={article.author?.id} />
      </main>

      <Footer />
    </div>
  );
}
