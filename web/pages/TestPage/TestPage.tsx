import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "@remixicon/react";
import DotBackground from "../../components/DotBackground/DotBackground.tsx";
import styles from "./TestPage.module.scss";

/**
 * 测试页：验证 oustr.github.io/nortu/test 能直达、路由跳转与回首页都正常。
 * 只做联调用，正式子页面就位后可以整目录删掉（记得同时删 App.tsx 里的路由）。
 */
const TestPage = () => (
  <div className={styles.page}>
    <DotBackground />
    <h1 className={styles.title}>测试页</h1>
    <p className={styles.note}>/test 路由已生效</p>
    <Link to="/" className={styles.back}>
      <RiArrowLeftLine size={20} />
      返回首页
    </Link>
  </div>
);

export default TestPage;
