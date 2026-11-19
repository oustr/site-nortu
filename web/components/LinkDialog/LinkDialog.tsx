import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  RiArrowRightLine,
  RiCloseLine,
  RiDownloadLine,
} from "@remixicon/react";
import styles from "./LinkDialog.module.scss";

/** 弹窗里的一条跳转条：文案 + 地址 */
export interface LinkDialogItem {
  title: string;
  href: string;
  /**
   * 有值表示这是本地文件下载：`href` 是打包后的资源地址，
   * `download` 是存盘时用的文件名，跳转条改用下载图标、不在新标签页打开。
   */
  download?: string;
}

/** 合并卡的弹窗内容 */
export interface LinkDialogContent {
  title: string;
  /** 说明文字，缺省时这一行不渲染 */
  note?: string;
  items: LinkDialogItem[];
}

interface LinkDialogProps {
  /** 为 null 表示弹窗关闭 */
  content: LinkDialogContent | null;
  onClose: () => void;
}

/*
 * 合并卡弹窗：首页上同一类资源合并成一张卡，点开后在弹窗里逐条跳转 / 下载。
 * 壳与联系方式弹窗一致：挂在 body 上（portal），打开时锁页面滚动，
 * Esc 或点遮罩空白处关闭。
 */
const LinkDialog = ({ content, onClose }: LinkDialogProps) => {
  useEffect(() => {
    if (!content) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [content, onClose]);

  if (!content) return null;

  return createPortal(
    <div
      className={styles.overlay}
      /* 只认点遮罩本身：从弹窗内部冒上来的点击不算 */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-dialog-title"
      >
        <header className={styles.header}>
          <h2 id="link-dialog-title" className={styles.title}>
            {content.title}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="关闭"
          >
            <RiCloseLine size={20} />
          </button>
        </header>

        {content.note && <p className={styles.note}>{content.note}</p>}
        <div className={styles.list}>
          {content.items.map((item) => {
            const isDownload = Boolean(item.download);

            return (
              <a
                key={item.href}
                className={styles.item}
                href={item.href}
                /* 下载条：就地存盘（文件名取 download 的值），不新开标签页 */
                download={item.download}
                target={isDownload ? undefined : "_blank"}
                rel={isDownload ? undefined : "noreferrer"}
              >
                <span className={styles.itemTitle}>{item.title}</span>
                {isDownload ? (
                  <RiDownloadLine size={18} className={styles.itemIcon} />
                ) : (
                  <RiArrowRightLine size={18} className={styles.itemIcon} />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LinkDialog;
