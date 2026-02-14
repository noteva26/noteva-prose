import { getArticleUrl } from "@/hooks/useNoteva";

interface ArticleCardProps {
  article: {
    id: number;
    slug?: string;
    title: string;
    excerpt?: string;
    cover?: string;
    thumbnail?: string;
    coverImage?: string;
    created_at?: string;
    createdAt?: string;
    is_pinned?: boolean;
    isPinned?: boolean;
    view_count?: number;
    viewCount?: number;
    comment_count?: number;
    commentCount?: number;
    category?: { name: string; slug: string };
    tags?: Array<{ name: string; slug: string }>;
    author?: { display_name?: string; username: string };
  };
  delay?: number;
  direction?: "left" | "right";
}

export default function ArticleCard({ article, delay = 0, direction = "left" }: ArticleCardProps) {
  const articleUrl = getArticleUrl(article);
  const coverImg = article.cover || article.thumbnail || article.coverImage;
  const date = article.created_at || article.createdAt || "";
  const views = article.view_count ?? article.viewCount ?? 0;
  const comments = article.comment_count ?? article.commentCount ?? 0;
  const pinned = article.is_pinned || article.isPinned;

  return (
    <article
      className={`article-card group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in-up flex ${direction === "right" ? "flex-row-reverse" : "flex-row"}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => window.location.href = articleUrl}
    >
      {/* 封面图 */}
      <a
        href={articleUrl}
        className={`block w-[200px] lg:w-[280px] xl:w-[320px] flex-shrink-0 overflow-hidden relative ${direction === "right" ? "rounded-r-2xl" : "rounded-l-2xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {coverImg ? (
          <img
            src={coverImg}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        )}
        {/* 置顶标记 */}
        {pinned && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-primary/90 text-white text-xs font-bold rounded-lg backdrop-blur-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>
            置顶
          </div>
        )}
      </a>

      {/* 文章信息 */}
      <div className="flex-1 min-w-0 p-5 lg:p-6 flex flex-col justify-between">
        <div>
          {/* 顶部元信息 */}
          <div className="flex items-center gap-3 mb-3 text-xs text-secondary-foreground">
            {article.category && (
              <a
                href={`/${article.category.slug}`}
                className="px-2.5 py-1 bg-primary/10 text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {article.category.name}
              </a>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(date).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </span>
            )}
          </div>

          {/* 标题 */}
          <a href={articleUrl} className="block" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg lg:text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h2>
          </a>

          {/* 摘要 */}
          {article.excerpt && (
            <p className="text-sm text-secondary-foreground line-clamp-2 leading-relaxed mb-3">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5">
            {article.tags && article.tags.length > 0 ? (
              article.tags.slice(0, 3).map((tag) => (
                <a
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="text-xs px-2 py-0.5 bg-secondary hover:bg-primary hover:text-white rounded-md transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag.name}
                </a>
              ))
            ) : null}
          </div>

          {/* 统计 */}
          <div className="flex items-center gap-3 text-xs text-secondary-foreground">
            {views > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {views}
              </span>
            )}
            {comments > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {comments}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
