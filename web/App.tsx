import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.tsx";
import styles from "./App.module.scss";

/**
 * 子页面按需加载：每个路由切出独立 chunk，进站只下载当前页的代码。
 * 首页不走 lazy：它就是入口，动态导入只会平白多一次请求。
 */
const TestPage = lazy(() => import("./pages/TestPage/TestPage.tsx"));

/**
 * 站点挂在 GitHub Pages 项目页 /nortu/ 下：构建时 base 是 /nortu/，dev/preview 是 /。
 * basename 必须跟着 base 走，否则会出现本地好使、线上整站 404。
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

/** 兜底页：路径不存在时给个回首页的出口，别让用户看空白 */
const NotFound = () => (
  <div className={styles.notFound}>
    <h1 className={styles.notFoundTitle}>页面不存在</h1>
    <p className={styles.notFoundNote}>这个地址没有对应的内容</p>
    <Link to="/" className={styles.notFoundLink}>
      返回首页
    </Link>
  </div>
);

const App = () => (
  /*
   * 路由间的共享状态放这里：Provider 包在 BrowserRouter 外层（或紧贴 Routes 外层），
   * 切页时只换 element，Provider 不会重新挂载，状态自然保持。
   */
  <BrowserRouter basename={basename}>
    {/* 懒加载子页面时先铺一块纸色底，避免白屏闪烁 */}
    <Suspense fallback={<div className={styles.fallback} />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
