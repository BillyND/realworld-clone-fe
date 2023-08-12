import { Route, Routes } from "react-router-dom";
import ArticlePage from "./components/ArticlePage";
import AuthPage from "./components/AuthPage";
import EditArticlePage from "./components/EditArticlePage";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import SettingPage from "./components/SettingPage";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/profile/:username/favorites" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingPage />} />
      <Route path="/editor" element={<EditArticlePage />} />
      <Route path="/editor/:slug" element={<EditArticlePage />} />
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default Layout;
