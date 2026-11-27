import styles from "./DotBackground.module.scss";

/**
 * 全页点阵底：固定铺在视口上，不进文档流、不吃点击。
 * 按页面按需引入，不做全局；页面自己负责 `position: relative`，
 * 并让正文元素的 z-index 压在这层之上（参考 HomePage / TestPage）。
 */
const DotBackground = () => <div className={styles.layer} aria-hidden="true" />;

export default DotBackground;
