import { useEffect } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine } from "@remixicon/react";
import styles from "./LogoDialog.module.scss";

/* 图里的坐标与 NortuLogo 的 viewBox 同一套单位（标记本身 26 × 21）：
 * 标记摆在 (10, 6.5) 起、26 × 21 的位置，四周留出标注用白边。 */
const MARK_LEFT = 10;
const MARK_TOP = 6.5;
const MARK_WIDTH = 26;
const MARK_HEIGHT = 21;
const MARK_RIGHT = MARK_LEFT + MARK_WIDTH; /* 36 */
const MARK_BOTTOM = MARK_TOP + MARK_HEIGHT; /* 27.5 */

/* 顶部尺寸线（数字坐在线上方） */
const DIM_TOP_Y = 4.4;
const DIM_TOP_LABEL_Y = 3.2;
/* 左侧尺寸线（21） */
const DIM_LEFT_X = 8.4;
const DIM_LEFT_LABEL_X = 6.7;
const DIM_LEFT_LABEL_Y = 17.7;
/* 尺寸线两端的小横/竖短线长度（以尺寸线为轴，各伸出一半） */
const TICK = 0.6;

/** 顶边三段宽度：左块 6、斜缝 6、右块 14，合计 26 */
const widthSegments = [
  { from: MARK_LEFT, to: MARK_LEFT + 6, label: "6" },
  { from: MARK_LEFT + 6, to: MARK_LEFT + 12, label: "6" },
  { from: MARK_LEFT + 12, to: MARK_RIGHT, label: "14" },
];

interface LogoDialogProps {
  open: boolean;
  onClose: () => void;
}

/*
 * 自由语 logo 弹窗：正中一块白卡，卡里把标记按原始单位放大重绘一遍，
 * 旁边标出测量图上的比例（顶边 6 / 6 / 14，左边 21），全部是矢量线条与文字。
 * 壳与联系方式、合并卡两个弹窗一致：挂在 body 上，打开时锁页面滚动，
 * 关闭方式只有右上角的 ×（项目规范，见 .codebuddy/rules/site-nortu）。
 */
const LogoDialog = ({ open, onClose }: LogoDialogProps) => {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    /* 遮罩不挂关闭事件：只有 ✕ 能关，点空白处不做任何事 */
    <div className={styles.overlay}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logo-dialog-title"
      >
        <header className={styles.header}>
          <h2 id="logo-dialog-title" className={styles.title}>
            自由语logo
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

        <div className={styles.figure}>
          {/* 视窗左边界往右收 1.6 个单位：整张图在卡里往左挪一点，标记不再偏右；
              右侧仍留得住 36 这个最右刻度 */}
          <svg
            className={styles.diagram}
            viewBox="1.6 0.4 40 28.4"
            role="img"
            aria-label="自由语 logo 比例：宽 26、高 21，顶边分段 6 / 6 / 14"
          >
            {/* 标记本体：与 NortuLogo 完全相同的两个多边形，只是平移了位置 */}
            <g fill="currentColor">
              <path d="M10 6.5h6l8 21H10Z" />
              <path d="M22 6.5h14v21h-6Z" />
            </g>

            <g className={styles.dims}>
              {/* 顶边：一整条尺寸线 + 三个分段刻度 + 段中数字 */}
              <line x1={MARK_LEFT} y1={DIM_TOP_Y} x2={MARK_RIGHT} y2={DIM_TOP_Y} />
              {widthSegments.map((segment) => (
                <g key={segment.label + segment.from}>
                  <line
                    x1={segment.from}
                    y1={DIM_TOP_Y - TICK}
                    x2={segment.from}
                    y2={DIM_TOP_Y + TICK}
                  />
                  <text
                    className={styles.dimText}
                    x={(segment.from + segment.to) / 2}
                    y={DIM_TOP_LABEL_Y}
                    textAnchor="middle"
                  >
                    {segment.label}
                  </text>
                </g>
              ))}
              {/* 顶边最右端也要一条刻度，收住 14 那一段 */}
              <line
                x1={MARK_RIGHT}
                y1={DIM_TOP_Y - TICK}
                x2={MARK_RIGHT}
                y2={DIM_TOP_Y + TICK}
              />

              {/* 左边：竖尺寸线 + 两端刻度 + 数字 21 */}
              <line
                x1={DIM_LEFT_X}
                y1={MARK_TOP}
                x2={DIM_LEFT_X}
                y2={MARK_BOTTOM}
              />
              <line
                x1={DIM_LEFT_X - TICK}
                y1={MARK_TOP}
                x2={DIM_LEFT_X + TICK}
                y2={MARK_TOP}
              />
              <line
                x1={DIM_LEFT_X - TICK}
                y1={MARK_BOTTOM}
                x2={DIM_LEFT_X + TICK}
                y2={MARK_BOTTOM}
              />
              <text
                className={styles.dimText}
                x={DIM_LEFT_LABEL_X}
                y={DIM_LEFT_LABEL_Y}
                textAnchor="end"
              >
                21
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoDialog;
