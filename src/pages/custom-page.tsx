import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNoteva } from "@/hooks/useNoteva";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RightSidebar from "@/components/RightSidebar";
import ArticleCard from "@/components/ArticleCard";

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'category' | 'tag' | 'page' | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    const loadContent = async () => {
      const Noteva = getNoteva();
      if (!Noteva) {
        setTimeout(loadContent, 50);
        return;
      }

      try {
        // 尝试作为分类加载
        const articles = await Noteva.articles.list({ category: slug });
        if (articles.articles.length > 0 || articles.total > 0) {
          setType('category');
          setContent(articles);
          setLoading(false);
          return;
        }

        // 尝试作为标签加载
        const tagArticles = await Noteva.articles.list({ tag: slug });
        if (tagArticles.articles.length > 0 || tagArticles.total > 0) {
          setType('tag');
          setContent(tagArticles);
          setLoading(false);
          return;
        }

        // 尝试作为自定义页面加载
        try {
          const result = await Noteva.api.get(`/page/${slug}`);
          setType('page');
          setContent(result.page);
          setLoading(false);
          return;
        } catch {
          // 页面不存在
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/2"></div>
            <div className="h-4 bg-secondary rounded w-1/4"></div>
            <div className="h-64 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!content || !type) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">页面未找到</h1>
          <p className="text-secondary-foreground mb-6">抱歉，您访问的页面不存在。</p>
          <a href="/" className="text-primary hover:underline">返回首页</a>
        </main>
        <Footer />
      </div>
    );
  }

  if (type === 'category' || type === 'tag') {
    const articles = content.articles || [];
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-24">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-bold mb-2">
                  {type === 'category' ? '分类' : '标签'}: {type === 'tag' ? '#' : ''}{slug}
                </h1>
                <p className="text-secondary-foreground">共 {articles.length} 篇文章</p>
              </div>
              
              <div className="flex flex-wrap justify-between gap-y-4 lg:gap-y-6">
                {articles.length > 0 ? (
                  articles.map((article: any, index: number) => (
                    <ArticleCard key={article.id} article={article} delay={index * 50} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-secondary-foreground">
                    该{type === 'category' ? '分类' : '标签'}下暂无文章
                  </div>
                )}
              </div>
            </div>
            
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

  // 自定义页面
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-[900px] w-full mx-auto px-4 py-24">
        <article className="animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-8">{content.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content_html || content.html || content.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
