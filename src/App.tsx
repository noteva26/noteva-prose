import { Routes, Route } from "react-router-dom";
import PluginSlot from "@/components/PluginSlot";
import RightSide from "@/components/RightSide";

// Pages
import HomePage from "@/pages/home";
import ArchivesPage from "@/pages/archives";
import CategoriesPage from "@/pages/categories";
import TagsPage from "@/pages/tags";
import PostPage from "@/pages/post";
import CustomPage from "@/pages/custom-page";

export default function App() {
  return (
    <>
      {/* body_start 插槽 */}
      <PluginSlot name="body_start" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archives" element={<ArchivesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/posts/*" element={<PostPage />} />
        <Route path="/:slug" element={<CustomPage />} />
      </Routes>

      {/* 右侧悬浮按钮 */}
      <RightSide />

      {/* body_end 插槽 */}
      <PluginSlot name="body_end" />
    </>
  );
}
