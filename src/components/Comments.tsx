import { useState, useEffect } from "react";
import { getNoteva } from "@/hooks/useNoteva";
import { useTranslation } from "@/lib/i18n";
import PluginSlot from "./PluginSlot";
import EmojiPicker from "./EmojiPicker";

interface Comment {
  id: number;
  article_id: number;
  user_id: number | null;
  parent_id: number | null;
  nickname: string | null;
  email: string | null;
  content: string;
  status: "pending" | "approved" | "spam";
  created_at: string;
  avatar_url: string;
  like_count: number;
  is_liked: boolean;
  is_author?: boolean;
  replies?: Comment[];
}

interface CommentsProps {
  articleId: number;
  authorId?: number;
}

export default function Comments({ articleId, authorId }: CommentsProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    content: "",
  });

  useEffect(() => {
    // 检查用户登录状态
    const checkUser = async () => {
      const Noteva = getNoteva();
      if (!Noteva) {
        setTimeout(checkUser, 50);
        return;
      }
      try {
        const currentUser = await Noteva.user.check();
        setUser(currentUser);
        setIsAdmin(currentUser?.role === "admin");
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    const Noteva = getNoteva();
    if (!Noteva) {
      setTimeout(loadComments, 50);
      return;
    }

    try {
      const result = await Noteva.api.get(`/comments/${articleId}`);
      setComments(result.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (parentId?: number) => {
    if (!form.content.trim()) {
      alert(t("comment.contentRequired"));
      return;
    }
    
    if (!isAdmin && !form.nickname.trim()) {
      alert(t("comment.nicknameRequired"));
      return;
    }

    const Noteva = getNoteva();
    if (!Noteva) return;

    setSubmitting(true);
    try {
      const input: any = {
        article_id: articleId,
        content: form.content,
        parent_id: parentId,
      };
      
      if (!isAdmin) {
        input.nickname = form.nickname;
        input.email = form.email;
      }

      await Noteva.api.post('/comments', input);
      setForm({ nickname: "", email: "", content: "" });
      setReplyTo(null);
      loadComments();
      
      // 触发评论创建后钩子
      if (Noteva.hooks) {
        Noteva.hooks.trigger("comment_after_create", { articleId, parentId });
      }
      if (Noteva.events) {
        Noteva.events.emit("comment:create", { articleId, parentId });
      }
    } catch (err: any) {
      alert(err.data?.error || "评论提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    const Noteva = getNoteva();
    if (!Noteva) return;

    try {
      await Noteva.api.post('/like', { 
        target_type: "comment", 
        target_id: commentId 
      });
      loadComments();
    } catch (err) {
      console.error("点赞失败:", err);
    }
  };

  const isAuthorComment = (comment: Comment) => {
    if (comment.is_author) return true;
    if (comment.user_id && authorId && comment.user_id === authorId) return true;
    return false;
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : "mt-6"}`}>
      <div className="flex gap-4">
        {/* 头像 */}
        <img
          src={comment.avatar_url}
          alt={comment.nickname || "User"}
          className="w-12 h-12 rounded-full flex-shrink-0"
        />
        
        <div className="flex-1">
          {/* 用户信息 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{comment.nickname || "匿名用户"}</span>
            {isAuthorComment(comment) && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded">
                {t("comment.authorTag")}
              </span>
            )}
            <span className="text-sm text-secondary-foreground">
              {new Date(comment.created_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          
          {/* 评论内容 */}
          <p className="text-foreground leading-relaxed mb-3">{comment.content}</p>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1 text-sm transition-colors ${
                comment.is_liked ? "text-red-500" : "text-secondary-foreground hover:text-red-500"
              }`}
            >
              <svg className={`w-4 h-4 ${comment.is_liked ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {comment.like_count > 0 && comment.like_count}
            </button>
            
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {t("comment.reply")}
            </button>
          </div>
          
          {/* 回复表单 */}
          {replyTo === comment.id && (
            <div className="mt-4 space-y-3 p-4 bg-secondary/30 rounded-lg">
              <textarea
                placeholder={t("comment.replyPlaceholder")}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {!isAdmin && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder={`${t("comment.nickname")} *`}
                    value={form.nickname}
                    onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    placeholder={t("comment.email")}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit(comment.id)}
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? t("comment.submitting") : t("comment.submitReply")}
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  {t("comment.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 子回复 */}
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {t("comment.title")} ({comments.length})
      </h2>

      {/* comment_form_before 插槽 - 评论表单前的提示 */}
      <PluginSlot name="comment_form_before" className="mb-4" />

      {/* 评论表单 */}
      <div className="mb-8 p-6 bg-card rounded-lg shadow-card">
        <div className="relative mb-4">
          <textarea
            placeholder={t("comment.placeholder")}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="absolute bottom-2 right-2">
            <EmojiPicker onSelect={(emoji) => setForm((f) => ({ ...f, content: f.content + emoji }))} />
          </div>
        </div>
        {!isAdmin && (
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder={`${t("comment.nickname")} *`}
              value={form.nickname}
              onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder={t("comment.email")}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        {isAdmin && (
          <p className="text-sm text-secondary-foreground mb-4">
            {t("comment.postingAsAdmin", { name: user?.display_name || user?.username })}
          </p>
        )}
        <button
          onClick={() => handleSubmit()}
          disabled={submitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t("comment.submitting")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {t("comment.submit")}
            </>
          )}
        </button>
      </div>

      {/* comment_form_after 插槽 - 评论表单后的提示 */}
      <PluginSlot name="comment_form_after" className="mb-6" />

      {/* 评论列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-secondary-foreground">{t("common.loading")}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-secondary-foreground">
            {t("comment.noComments")}
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
