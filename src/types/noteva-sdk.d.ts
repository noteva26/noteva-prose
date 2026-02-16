/**
 * Noteva SDK Type Definitions
 */

interface NotevaAPI {
  get(url: string, params?: any): Promise<any>;
  post(url: string, data?: any): Promise<any>;
  put(url: string, data?: any): Promise<any>;
  delete(url: string): Promise<any>;
}

interface NotevaSite {
  getInfo(): Promise<{
    name: string;
    description: string;
    subtitle: string;
    logo: string;
    footer: string;
    permalinkStructure?: string;
  }>;
  getArticleUrl(article: { id: number | string; slug?: string }): string;
  getThemeConfig(key?: string): any;
  getThemeSettings(key?: string): Promise<Record<string, string> | string | undefined>;
}

interface NotevaArticles {
  list(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    tag?: string;
    keyword?: string;
  }): Promise<{
    articles: any[];
    total: number;
  }>;
  get(slug: string): Promise<any>;
}

interface NotevaCategories {
  list(): Promise<any[]>;
}

interface NotevaTags {
  list(): Promise<any[]>;
}

interface NotevaUser {
  check(): Promise<any>;
  login(credentials: { username: string; password: string }): Promise<any>;
  logout(): Promise<void>;
}

interface NotevaHooks {
  trigger(name: string, data?: any): void;
}

interface NotevaEvents {
  emit(name: string, data?: any): void;
}

interface NotevaSDK {
  ready(): Promise<void>;
  api: NotevaAPI;
  site: NotevaSite;
  articles: NotevaArticles;
  categories: NotevaCategories;
  tags: NotevaTags;
  user: NotevaUser;
  hooks?: NotevaHooks;
  events?: NotevaEvents;
  emoji?: {
    categories: Array<{ id: string; label: Record<string, string>; icon: string; emojis: Record<string, string> }>;
    getCategories(locale?: string): Array<{ id: string; label: string; icon: string; emojis: Record<string, string> }>;
    getMap(): Record<string, string>;
    loadTwemoji(): Promise<any>;
    parse(element: HTMLElement, options?: Record<string, any>): Promise<void>;
    parseSync(element: HTMLElement, options?: Record<string, any>): void;
    isLoaded(): boolean;
  };
}

declare global {
  interface Window {
    Noteva: NotevaSDK;
  }
}

export {};
