"use client";

import { useSiteInfo } from "@/hooks/useNoteva";

export default function LeftSidebar() {
  const { info } = useSiteInfo();

  return (
    <div className="space-y-6">
      {/* 作者卡片 - 渐变背景 */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-main animate-scale-in" style={{ background: 'var(--gradient-1)' }}>
        {/* 装饰性背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* 内容 */}
        <div className="relative z-10">
          {/* 头像 */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300">
              <img
                src={info?.logo || "/logo.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* 名称和描述 */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">{info?.name || "Noteva"}</h2>
            {info?.description && (
              <p className="text-sm text-white/90 leading-relaxed">
                {info.description}
              </p>
            )}
          </div>
          
          {/* 社交链接 */}
          <div className="flex justify-center gap-3 mt-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="mailto:contact@example.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:scale-110 transition-all"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="group cursor-pointer">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent group-hover:scale-110 transition-transform">42</div>
            <div className="text-sm text-secondary-foreground mt-1">文章</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-2xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent group-hover:scale-110 transition-transform">8</div>
            <div className="text-sm text-secondary-foreground mt-1">分类</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">16</div>
            <div className="text-sm text-secondary-foreground mt-1">标签</div>
          </div>
        </div>
      </div>
    </div>
  );
}
