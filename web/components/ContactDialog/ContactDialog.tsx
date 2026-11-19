import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiCheckLine, RiCloseLine, RiFileCopyLine } from "@remixicon/react";
import styles from "./ContactDialog.module.scss";

/** 一张联系方式卡：平台名 + 浅灰副标题 + 一条主内容（点卡片复制这条） */
interface ContactCard {
  label: string;
  desc: string;
  value: string;
}

const authorCards: ContactCard[] = [
  { label: "QQ群", desc: "自由语讨论群", value: "1048896534" },
  { label: "X", desc: "nosto", value: "nosto__" },
  { label: "B站", desc: "nosto_", value: "3546889005828619" },
  { label: "小红书", desc: "nosto", value: "nosto_" },
];

const communityCard: ContactCard = {
  label: "QQ群",
  desc: "社区自由语设计/讨论群 Ainz-soro ote Anoz'i Noruts",
  value: "1134401051",
};

const COPIED_HOLD_MS = 1400;

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

/*
 * 联系方式弹窗：遮罩 + 正中白卡。
 * 弹窗挂在 body 上（portal），不受首页排版与点阵层的影响；
 * 打开时锁住页面滚动，Esc 或点遮罩空白处关闭。
 */
const ContactDialog = ({ open, onClose }: ContactDialogProps) => {
  /** 刚复制过的那张卡的 key，用来把图标换成对勾 */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  /* 关闭时把「已复制」的清掉，下次打开不会停在打勾状态 */
  useEffect(() => {
    if (open) return;

    window.clearTimeout(timerRef.current);
    setCopiedKey(null);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  if (!open) return null;

  const handleCopy = async (card: ContactCard) => {
    try {
      await navigator.clipboard.writeText(card.value);
    } catch {
      /* 剪贴板不可用（非安全上下文等）：什么都不做，别报错打断 */
      return;
    }

    setCopiedKey(`${card.label}-${card.value}`);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setCopiedKey(null),
      COPIED_HOLD_MS
    );
  };

  const renderCard = (card: ContactCard) => {
    const key = `${card.label}-${card.value}`;
    const copied = copiedKey === key;

    return (
      <button
        key={key}
        type="button"
        className={styles.card}
        onClick={() => handleCopy(card)}
        aria-label={`复制 ${card.label}：${card.value}`}
      >
        <span className={styles.cardText}>
          <span className={styles.cardLabel}>{card.label}</span>
          <span className={styles.cardDesc}>{card.desc}</span>
          <span className={styles.cardValue}>{card.value}</span>
        </span>
        {copied ? (
          <RiCheckLine size={16} className={styles.copyActive} />
        ) : (
          <RiFileCopyLine size={16} className={styles.copy} />
        )}
      </button>
    );
  };

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
        aria-labelledby="contact-dialog-title"
      >
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="contact-dialog-title" className={styles.title}>
              联系方式
            </h2>
            <p className={styles.subtitle}>自由语作者 nosto</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="关闭"
          >
            <RiCloseLine size={20} />
          </button>
        </header>

        <div className={styles.grid}>{authorCards.map(renderCard)}</div>

        <hr className={styles.divider} />

        <div className={styles.community}>
          <p className={styles.note}>
            以下为社区自由语，即为社区对标准自由语进行改造后的衍生语言，和标准自由语有较大区别
          </p>
          {renderCard(communityCard)}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactDialog;
