# Prose Theme for Noteva

轻量、优雅的三栏布局博客主题。

## 特性

- ✨ 三栏布局 — 左侧作者信息 + 中间内容区 + 右侧推荐
- 🎨 暗色模式 — 支持亮色/暗色主题切换
- 📱 响应式设计 — 适配桌面、平板、手机
- � 多语言 — 支持中文、繁体中文、英文
- 💬 内置评论 — 使用 Noteva SDK 评论系统
- 🏷️ 分类标签 — 完整的分类和标签支持

## 技术栈

- **框架**: React 18 + React Router
- **构建**: Vite
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **SDK**: Noteva SDK

## 页面

| 路由 | 说明 |
|------|------|
| `/` | 首页（文章列表） |
| `/posts/:slug` | 文章详情 |
| `/archives` | 归档（按年份分组） |
| `/categories` | 分类列表 |
| `/tags` | 标签云 |
| `/:slug` | 自定义页面 |

## 开发

```bash
pnpm install
pnpm dev      # 开发模式
pnpm build    # 构建
```

## 许可证

MIT License
