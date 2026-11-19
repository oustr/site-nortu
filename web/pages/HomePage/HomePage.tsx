import { RiArrowRightUpLine } from "@remixicon/react";
import styles from "./HomePage.module.scss";

interface ResourceLink {
  /** 卡片第一行：这份资源属于哪一类 */
  label: string;
  /** 卡片第二行：资源名称 */
  title: string;
  href: string;
}

const links: ResourceLink[] = [
  {
    label: "自由语",
    title: "在线词汇表",
    href: "https://workbuddy.link/p/Ujsotr3QgY8wHUXIXHXgvN?source=2",
  },
  {
    label: "自由语语法",
    title: "语块",
    href: "https://workbuddy.link/p/AZsFvGlJSBD0xUBIci1tku?source=2",
  },
  {
    label: "自由语语法",
    title: "“动词时态”",
    href: "https://workbuddy.link/p/Nvrs3hfpDlKN87QraceNQk?source=2",
  },
  {
    label: "自由语语法",
    title: "uv",
    href: "https://workbuddy.link/p/Ia9RUMvqSUTAWC7kgjhXYZ?source=2",
  },
];

const HomePage = () => (
  <div className={styles.page}>
    <div className={styles.cards}>
      {links.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={styles.card}
        >
          <span className={styles.text}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.title}>{item.title}</span>
          </span>
          <RiArrowRightUpLine size={18} className={styles.arrow} />
        </a>
      ))}
    </div>
  </div>
);

export default HomePage;
