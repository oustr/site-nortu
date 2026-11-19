import { RiArrowRightLine, RiDownloadLine } from "@remixicon/react";
import styles from "./HomePage.module.scss";
import vocabularyUrl from "../../assets/downloads/nortu-vocabulary.jsonl?url";
import nozuSansUrl from "../../assets/fonts/nozu-sans-nortu.woff2?url";

interface ResourceLink {
  /** 卡片第一行：资源类别，缺省时这一行不渲染 */
  label?: string;
  /** 卡片第二行：资源名称 */
  title: string;
  /** 卡片第三行：作者，渲染为「by xxx」 */
  author: string;
  href: string;
  /**
   * 有值表示这是本地文件下载：`href` 是打包后的资源地址，
   * `download` 是存盘时用的文件名，卡片改用下载图标、不在新标签页打开。
   */
  download?: string;
}

interface ResourceSection {
  /** 大类标题里的 Nortu 语词，字号比中文大一档 */
  word: string;
  /** 大类标题 */
  title: string;
  links: ResourceLink[];
}

const sections: ResourceSection[] = [
  {
    word: "zoxıg",
    title: "基建",
    links: [
      {
        label: "自由语",
        title: "在线词汇表",
        author: "nosto",
        href: "https://workbuddy.link/p/Ujsotr3QgY8wHUXIXHXgvN?source=2",
      },
      {
        label: "自由语语法",
        title: "语块",
        author: "nosto",
        href: "https://workbuddy.link/p/AZsFvGlJSBD0xUBIci1tku?source=2",
      },
      {
        label: "自由语语法",
        title: "“动词时态”",
        author: "nosto",
        href: "https://workbuddy.link/p/Nvrs3hfpDlKN87QraceNQk?source=2",
      },
      {
        label: "自由语语法",
        title: "uv",
        author: "nosto",
        href: "https://workbuddy.link/p/Ia9RUMvqSUTAWC7kgjhXYZ?source=2",
      },
      {
        label: "JSONL数据文件",
        title: "自由语词汇表",
        author: "nosto",
        href: vocabularyUrl,
        download: "Nortu Vocabulary.jsonl",
      },
      {
        label: "WOFF2字体",
        title: "Nozu硬黑体",
        author: "nosto",
        href: nozuSansUrl,
        download: "Nozu Sans for Nortu.woff2",
      },
    ],
  },
  {
    word: "uzgo",
    title: "游戏",
    links: [
      {
        label: "自由语多邻国",
        title: "『诺斯通』",
        author: "酱的不卷",
        href: "https://nortu-free-language-l1-2.app.workbuddy.host/?sharecode=TNWRVMOI4N&shareId=b9a912e4a4844f22ac2017fd7985e543",
      },
      {
        title: "Nortu花园",
        author: "酱的不卷",
        href: "https://nortu-garden.app.workbuddy.host/?sharecode=SNL77WKJI3&shareId=f9b6a709919941c4b2a524a1b0d07c5b",
      },
      {
        label: "土豆农场",
        title: "orgoz su-nonz",
        author: "nosto",
        href: "https://workbuddy.link/p/7HgSXDrvI9h9jGaqaNhYMK?source=2",
      },
    ],
  },
];

const HomePage = () => (
  <div className={styles.page}>
    <h1 className={styles.heading}>
      <span className={styles.headingMain}>Nortu</span>
      <span className={styles.headingSub}>自由语</span>
    </h1>
    {sections.map((section) => (
      <section key={section.title} className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionWord}>{section.word}</span>
          <span>{section.title}</span>
        </h2>
        <div className={styles.cards}>
          {section.links.map((item) => {
            const isDownload = Boolean(item.download);
            return (
              <a
                key={item.href}
                href={item.href}
                /* 下载卡：就地存盘（文件名取 download 的值），不新开标签页 */
                download={item.download}
                target={isDownload ? undefined : "_blank"}
                rel={isDownload ? undefined : "noreferrer"}
                className={styles.card}
              >
                <span className={styles.text}>
                  {item.label && (
                    <span className={styles.label}>{item.label}</span>
                  )}
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.author}>by {item.author}</span>
                </span>
                {isDownload ? (
                  <RiDownloadLine size={24} className={styles.arrow} />
                ) : (
                  <RiArrowRightLine size={24} className={styles.arrow} />
                )}
              </a>
            );
          })}
        </div>
      </section>
    ))}
  </div>
);

export default HomePage;
