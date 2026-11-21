import { useCallback, useState } from "react";
import {
  RiArrowRightLine,
  RiDownloadLine,
  RiShareLine,
} from "@remixicon/react";
import ContactDialog from "../../components/ContactDialog/ContactDialog.tsx";
import LinkDialog, {
  type LinkDialogContent,
} from "../../components/LinkDialog/LinkDialog.tsx";
import LogoDialog from "../../components/LogoDialog/LogoDialog.tsx";
import NortuLogo from "../../components/NortuLogo/NortuLogo.tsx";
import styles from "./HomePage.module.scss";
import vocabularyUrl from "../../assets/downloads/nortu-vocabulary.jsonl?url";
import textbookPdfUrl from "../../assets/downloads/自由语教材261120a.pdf?url";
import nozuSansUrl from "../../assets/fonts/nozu-sans-nortu.woff2?url";

interface ResourceLink {
  /** 卡片第一行：资源类别，缺省时这一行不渲染 */
  label?: string;
  /** 卡片第二行：资源名称 */
  title: string;
  /** 卡片第三行：作者，渲染为「by xxx」 */
  author: string;
  /** 直接跳转（或下载）的地址；合并卡没有这一项 */
  href?: string;
  /**
   * 有值表示这是本地文件下载：`href` 是打包后的资源地址，
   * `download` 是存盘时用的文件名，卡片改用下载图标、不在新标签页打开。
   */
  download?: string;
  /**
   * 有值表示这是合并卡：卡片本身不跳转，点开弹窗，
   * 弹窗里是这一类资源各自的跳转条 / 下载条。
   */
  dialog?: LinkDialogContent;
}

/** 「自由语词汇表」合并卡：在线词汇表 + JSONL 数据文件 */
const vocabularyDialog: LinkDialogContent = {
  title: "自由语词汇表",
  note: "在线查看，或下载 JSONL 数据文件",
  items: [
    {
      title: "在线词汇表",
      href: "https://workbuddy.link/p/Ujsotr3QgY8wHUXIXHXgvN?source=2",
    },
    {
      title: "JSONL数据文件",
      href: vocabularyUrl,
      download: "Nortu Vocabulary.jsonl",
    },
  ],
};

/** 「自由语语法」合并卡：八篇语法文档 */
const grammarDialog: LinkDialogContent = {
  title: "自由语语法",
  note: "以下八篇文档，点任意一条在新标签页打开",
  items: [
    {
      title: "语块",
      href: "https://workbuddy.link/p/AZsFvGlJSBD0xUBIci1tku?source=2",
    },
    {
      title: "“动词时态”",
      href: "https://workbuddy.link/p/Nvrs3hfpDlKN87QraceNQk?source=2",
    },
    {
      title: "主宾 主被动",
      href: "https://workbuddy.link/p/MdpfGOnPuUQkhs5VOcuJVu?source=2",
    },
    {
      title: "uv",
      href: "https://workbuddy.link/p/Ia9RUMvqSUTAWC7kgjhXYZ?source=2",
    },
    {
      title: "使动",
      href: "https://workbuddy.link/p/pc3ladNQ9ql2QUEW6zwlTY?source=2",
    },
    {
      title: "更 最",
      href: "https://workbuddy.link/p/g2JXp1fqiEPMrAxr2D9HKD?source=2",
    },
    {
      title: "能 可能",
      href: "https://workbuddy.link/p/ghnDckzD9lCU3HWmJCtk3I?source=2",
    },
    {
      title: "数字",
      href: "https://workbuddy.link/p/CzZKnp818PhxBGHbvLUOaz?source=2",
    },
  ],
};

/** 「自由语教材」合并卡：在线教材 + PDF 文件 */
const textbookDialog: LinkDialogContent = {
  title: "自由语教材",
  note: "在线查看，或下载 PDF 教材",
  items: [
    {
      title: "在线教材",
      href: "https://nortu-textbook.app.workbuddy.host/?sharecode=5VGLARADJX&shareId=a385d2fd27f5434abb1e93906a597bfc",
    },
    {
      title: "PDF文件",
      href: textbookPdfUrl,
      download: "自由语教材261120a.pdf",
    },
  ],
};

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
        title: "自由语词汇表",
        author: "nosto",
        dialog: vocabularyDialog,
      },
      {
        title: "自由语语法",
        author: "nosto",
        dialog: grammarDialog,
      },
      {
        title: "自由语教材",
        author: "酱的不卷",
        dialog: textbookDialog,
      },
      {
        label: "WOFF2自由语字体",
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

const HomePage = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const closeContact = useCallback(() => setContactOpen(false), []);
  /** 标题左边的 logo 钮：点开看标记的比例图 */
  const [logoOpen, setLogoOpen] = useState(false);
  const closeLogo = useCallback(() => setLogoOpen(false), []);
  /** 当前打开的合并卡弹窗，null 表示都没开 */
  const [dialogContent, setDialogContent] = useState<LinkDialogContent | null>(
    null
  );
  const closeDialog = useCallback(() => setDialogContent(null), []);

  return (
    <div className={styles.page}>
      {/* 右上角联系方式：点开弹窗，与页面内容互不干扰 */}
      <button
        type="button"
        className={styles.contactButton}
        onClick={() => setContactOpen(true)}
        aria-label="联系方式"
        title="联系方式"
      >
        <RiShareLine size={20} />
      </button>
      <h1 className={styles.heading}>
        {/* logo 与 Nortu 同一组、按基线对齐：标记底边正好压在文字基线上 */}
        <span className={styles.headingWord}>
          <button
            type="button"
            className={styles.logoButton}
            onClick={() => setLogoOpen(true)}
            aria-label="查看自由语 logo 比例"
            title="自由语 logo"
          >
            <NortuLogo className={styles.logoMark} />
          </button>
          <span className={styles.headingMain}>Nortu</span>
        </span>
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
              const cardBody = (
                <>
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
                </>
              );

              /* 合并卡：本身不跳转，点开弹窗后逐条跳转 / 下载 */
              const cardDialog = item.dialog;
              if (cardDialog) {
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={`${styles.card} ${styles.cardButton}`}
                    onClick={() => setDialogContent(cardDialog)}
                    aria-haspopup="dialog"
                  >
                    {cardBody}
                  </button>
                );
              }

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
                  {cardBody}
                </a>
              );
            })}
          </div>
        </section>
      ))}
      <ContactDialog open={contactOpen} onClose={closeContact} />
      <LinkDialog content={dialogContent} onClose={closeDialog} />
      <LogoDialog open={logoOpen} onClose={closeLogo} />
    </div>
  );
};

export default HomePage;
