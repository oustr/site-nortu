import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiCheckLine, RiCloseLine, RiFileCopyLine } from "@remixicon/react";
import styles from "./ContactDialog.module.scss";
import qqGroupQrUrl from "../../assets/images/qq-group-free-language.svg?url";

/** 一张联系方式卡：平台名 + 浅灰副标题 + 一条主内容（点卡片复制这条） */
interface ContactCard {
  label: string;
  desc: string;
  value: string;
}

/** 合并块里的一行：平台名 + 用户名 + 账号（点这一行只复制账号） */
interface ContactRowItem {
  label: string;
  name: string;
  value: string;
}

/** 合并块：同一个人的各平台联络方式归在一起，逐行复制 */
interface ContactBlock {
  heading: string;
  rows: ContactRowItem[];
}

/** 自由语讨论群：二维码 + 群名 + 群号收在同一张卡里，点卡复制群号 */
const groupInfo = {
  label: "QQ群",
  name: "自由语（Nortu）讨论群",
  value: "1048896534",
};

const authorBlock: ContactBlock = {
  heading: "nosto",
  rows: [
    { label: "X", name: "nosto", value: "nosto__" },
    { label: "B站", name: "nosto_", value: "3546889005828619" },
    { label: "小红书", name: "nosto", value: "nosto_" },
  ],
};

const communityCard: ContactCard = {
  label: "QQ群",
  desc: "社区自由语设计/讨论群 Ainz-soro ote Anoz'i Noruts",
  value: "1134401051",
};

const contributorBlock: ContactBlock = {
  heading: "酱的不卷",
  rows: [{ label: "B站", name: "酱的不卷", value: "3707006902864287" }],
};

const COPIED_HOLD_MS = 1400;

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

/*
 * 联系方式弹窗：遮罩 + 正中白卡。
 * 弹窗挂在 body 上（portal），不受首页排版与点阵层的影响；
 * 打开时锁住页面滚动。
 * 关闭方式只有右上角的 ×：点遮罩、按 Esc 都不关（项目规范，见 .codebuddy/rules/site-nortu）。
 */
const ContactDialog = ({ open, onClose }: ContactDialogProps) => {
  /** 刚复制过的那张卡的 key，用来把图标换成对勾 */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /* 关闭时把「已复制」的清掉，下次打开不会停在打勾状态 */
  useEffect(() => {
    if (open) return;

    window.clearTimeout(timerRef.current);
    setCopiedKey(null);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  if (!open) return null;

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* 剪贴板不可用（非安全上下文等）：什么都不做，别报错打断 */
      return;
    }

    setCopiedKey(key);
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
        onClick={() => handleCopy(card.value, key)}
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

  /*
   * 讨论群卡：卡头是平台名与复制图标，卡身左边二维码、右边群名与群号。
   * 整张卡仍是一个复制按钮，点哪儿都复制群号。
   */
  const renderGroupCard = () => {
    const key = `${groupInfo.label}-${groupInfo.value}`;
    const copied = copiedKey === key;

    return (
      <button
        key={key}
        type="button"
        className={styles.groupCard}
        onClick={() => handleCopy(groupInfo.value, key)}
        aria-label={`复制 ${groupInfo.label}：${groupInfo.value}`}
      >
        <span className={styles.groupHead}>
          <span className={styles.groupLabel}>{groupInfo.label}</span>
          {copied ? (
            <RiCheckLine size={16} className={styles.groupCopyActive} />
          ) : (
            <RiFileCopyLine size={16} className={styles.groupCopy} />
          )}
        </span>
        <span className={styles.groupBody}>
          <span className={styles.qr}>
            <img
              className={styles.qrImage}
              src={qqGroupQrUrl}
              alt={`${groupInfo.name} ${groupInfo.value} 二维码`}
              width={84}
              height={84}
              loading="lazy"
            />
            <span className={styles.qrCaption}>扫码进群噢</span>
          </span>
          <span className={styles.groupInfo}>
            <span className={styles.groupName}>{groupInfo.name}</span>
            <span className={styles.groupValue}>{groupInfo.value}</span>
          </span>
        </span>
      </button>
    );
  };

  /* 合并块：一个名字带若干行平台号，点哪行复制哪行 */
  const renderBlock = (block: ContactBlock) => (
    <div key={block.heading} className={styles.block}>
      <span className={styles.blockHeading}>{block.heading}</span>
      <div className={styles.rows}>
        {block.rows.map((row) => {
          const key = `${block.heading}-${row.label}-${row.value}`;
          const copied = copiedKey === key;

          return (
            <button
              key={row.label}
              type="button"
              className={styles.row}
              onClick={() => handleCopy(row.value, key)}
              aria-label={`复制 ${block.heading} 的 ${row.label}：${row.name} ${row.value}`}
            >
              <span className={styles.rowText}>
                <span className={styles.rowLabel}>{row.label}</span>
                <span className={styles.rowName}>{row.name}</span>
                <span className={styles.rowValue}>{row.value}</span>
              </span>
              {copied ? (
                <RiCheckLine size={14} className={styles.rowIconActive} />
              ) : (
                <RiFileCopyLine size={14} className={styles.rowIcon} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return createPortal(
    /* 遮罩不挂关闭事件：只有 ✕ 能关，点空白处不做任何事 */
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
      >
        <header className={styles.header}>
          <h2 id="contact-dialog-title" className={styles.title}>
            联系方式
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

        <h3 className={styles.sectionTitle}>自由语及作者</h3>
        <div className={styles.grid}>
          {/* 自由语讨论群：二维码与群号合并在同一张卡里 */}
          {renderGroupCard()}
          {renderBlock(authorBlock)}
        </div>

        <hr className={styles.divider} />

        <h3 className={styles.sectionTitle}>自由语贡献者</h3>
        <div className={styles.grid}>{renderBlock(contributorBlock)}</div>

        <hr className={styles.divider} />

        <p className={styles.note}>
          以下为社区自由语，即为社区对标准自由语进行改造后的衍生语言，和标准自由语有较大区别
        </p>
        <div className={styles.grid}>{renderCard(communityCard)}</div>
      </div>
    </div>,
    document.body
  );
};

export default ContactDialog;
