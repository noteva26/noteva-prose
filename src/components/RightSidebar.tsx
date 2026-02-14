import { useTags, useCategories, useArticles, useSiteInfo } from "@/hooks/useNoteva";

export default function RightSidebar() {
  const { info } = useSiteInfo();
  const { tags } = useTags();
  const { categories } = useCategories();
  const { articles } = useArticles({ page: 1, pageSize: 100 });

  // 统计
  const totalViews = articles.reduce((sum, a: any) => sum + (a.view_count ?? a.viewCount ?? 0), 0);
  const totalComments = articles.reduce((sum, a: any) => sum + (a.comment_count ?? a.commentCount ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* 作者卡片 */}
      <div className="author-card relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all animate-scale-in">
        {/* 顶部渐变背景 */}
        <div className="h-24 bg-gradient-to-r from-[#667eea] via-[#5b72ff] to-[#764ba2] relative">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/20 blur-sm"></div>
            <div className="absolute bottom-1 left-6 w-10 h-10 rounded-full bg-white/10"></div>
          </div>
        </div>

        {/* 头像 - 悬浮在渐变和白色之间 */}
        <div className="flex justify-center -mt-12 relative z-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-lg hover:scale-110 transition-transform duration-300">
            <img
              src={info?.logo || "/logo.png"}
              alt={info?.name || "Avatar"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="px-5 pb-5 pt-3 text-center">
          <h2 className="text-lg font-bold text-foreground">{info?.name || "Noteva"}</h2>
          <p className="text-xs text-secondary-foreground mt-1 leading-relaxed">
            {info?.description || info?.subtitle || "欢迎来到我的博客"}
          </p>

          {/* 数据统计 */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-secondary">
            <a href="/archives" className="group text-center">
              <div className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{articles.length}</div>
              <div className="text-xs text-secondary-foreground">文章</div>
            </a>
            <a href="/categories" className="group text-center">
              <div className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{categories.length}</div>
              <div className="text-xs text-secondary-foreground">分类</div>
            </a>
            <a href="/tags" className="group text-center">
              <div className="text-xl font-bold text-primary group-hover:scale-110 transition-transform">{tags.length}</div>
              <div className="text-xs text-secondary-foreground">标签</div>
            </a>
          </div>
        </div>
      </div>

      {/* 标签云 */}
      {tags.length > 0 && (
        <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-foreground">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-primary-light"></div>
            标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 20).map((tag: any) => (
              <a
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-secondary hover:bg-primary hover:text-white transition-all hover:scale-105"
              >
                #{tag.name}
                {(tag.count || tag.article_count) ? (
                  <span className="opacity-60">{tag.count || tag.article_count}</span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 网站信息 */}
      <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-foreground">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-accent to-secondary"></div>
          站点资讯
        </h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-secondary-foreground">文章数目</span>
            <span className="font-medium">{articles.length} 篇</span>
          </div>
          {totalViews > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-secondary-foreground">总浏览量</span>
              <span className="font-medium">{totalViews.toLocaleString()}</span>
            </div>
          )}
          {totalComments > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-secondary-foreground">总评论数</span>
              <span className="font-medium">{totalComments}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-secondary-foreground">分类数</span>
            <span className="font-medium">{categories.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-foreground">标签数</span>
            <span className="font-medium">{tags.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
