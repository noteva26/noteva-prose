import { useArticles, getArticleUrl } from "@/hooks/useNoteva";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ArchivesPage() {
  const { articles, loading } = useArticles({ page: 1, pageSize: 100 });

  // 按年份分组
  const articlesByYear = articles.reduce((acc, article) => {
    const date = article.created_at || article.createdAt || "";
    const year = new Date(date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(article);
    return acc;
  }, {} as Record<number, typeof articles>);

  const years = Object.keys(articlesByYear).sort((a, b) => Number(b) - Number(a));

  // 全局序号
  let globalIndex = 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 页面顶部 Banner */}
      <div className="page-banner relative pt-16 overflow-hidden">
        <div className="archive-banner relative py-20 lg:py-28">
          {/* 动态背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[120px] h-[120px] rounded-full bg-white/10 animate-float"></div>
            <div className="absolute top-[20%] right-[15%] w-[80px] h-[80px] rounded-full bg-white/5 animate-float" style={{ animationDelay: "1s" }}></div>
            <div className="absolute bottom-[15%] left-[20%] w-[60px] h-[60px] rounded-full bg-white/8 animate-float" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-[10%] right-[8%] w-[100px] h-[100px] rounded-full bg-white/5 animate-float" style={{ animationDelay: "0.5s" }}></div>
          </div>
          <div className="relative max-w-[900px] mx-auto px-4 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm mb-5 animate-fade-in-up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              时光机
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: "80ms" }}>归档</h1>
            <p className="text-white/80 text-lg animate-fade-in-up" style={{ animationDelay: "160ms" }}>
              共 <span className="font-bold text-white text-2xl mx-1">{articles.length}</span> 篇文章，记录每一个瞬间
            </p>
          </div>
        </div>
        {/* 波浪 */}
        <svg className="relative block w-full h-[40px] -mt-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="var(--background)" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="var(--background)" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--background)"></path>
        </svg>
      </div>

      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-secondary rounded w-32 mb-4"></div>
                <div className="space-y-3 ml-6">
                  <div className="h-20 bg-card rounded-xl"></div>
                  <div className="h-20 bg-card rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {years.map((year, yearIndex) => {
              const yearArticles = articlesByYear[Number(year)];
              return (
                <div
                  key={year}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${yearIndex * 100}ms` }}
                >
                  {/* 年份标题 */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="archive-year-badge relative">
                      <span className="text-3xl font-extrabold gradient-text">{year}</span>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-full">
                      {yearArticles.length} 篇
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent"></div>
                  </div>

                  {/* 文章列表 - 安知鱼风格卡片 */}
                  <div className="space-y-3">
                    {yearArticles.map((article: any) => {
                      globalIndex++;
                      const date = article.created_at || article.createdAt || "";
                      const cover = article.cover || article.thumbnail || article.coverImage;
                      return (
                        <a
                          key={article.id}
                          href={getArticleUrl(article)}
                          className="archive-item group relative flex items-center bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {/* 封面缩略图 */}
                          {cover && (
                            <div className="w-[151px] h-[80px] flex-shrink-0 overflow-hidden">
                              <img
                                src={cover}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* 文章信息 */}
                          <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between h-[80px]">
                            <h3 className="font-bold text-[15px] group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-secondary-foreground">
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  {article.tags.slice(0, 2).map((tag: any) => (
                                    <span key={tag.slug} className="flex items-center gap-0.5 text-secondary-foreground/70">
                                      <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                      {tag.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(date).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}
                              </span>
                              {(article.view_count ?? article.viewCount ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                  {article.view_count ?? article.viewCount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 序号 */}
                          <span className="absolute top-2 right-3 text-3xl font-bold italic opacity-[0.06] select-none">
                            {globalIndex}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-16 text-secondary-foreground">暂无文章</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
