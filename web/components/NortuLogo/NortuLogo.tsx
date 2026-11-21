interface NortuLogoProps {
  /** 只用于定尺寸（宽高比例已由 viewBox 锁定），颜色走 currentColor */
  className?: string;
}

/*
 * 自由语（Nortu）标记：一块 26 × 21 的矩形，被一条宽 6 的斜缝切开。
 *
 * 比例取自测量图：顶边三段依次是 6 / 6 / 14，高 21；
 * 斜缝在 21 的高度里向右平移 8 —— 于是左块底宽 14、右块底宽 6，
 * 两条斜边互相平行，缝的**水平宽度**始终是 6。
 *
 * viewBox 直接用这套原始单位（26 × 21），所以画出来的就是准确的比例：
 * 左块 (0,0) (6,0) (14,21) (0,21)，右块 (12,0) (26,0) (26,21) (20,21)。
 */
const NortuLogo = ({ className }: NortuLogoProps) => (
  <svg
    className={className}
    viewBox="0 0 26 21"
    role="img"
    aria-label="自由语 logo"
    focusable="false"
  >
    <path d="M0 0h6l8 21H0Z" fill="currentColor" />
    <path d="M12 0h14v21h-6Z" fill="currentColor" />
  </svg>
);

export default NortuLogo;
