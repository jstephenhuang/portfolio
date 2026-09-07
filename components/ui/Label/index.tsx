import cx from "classnames";

import styles from "./styles.module.scss";

export type LabelTone = "neutral" | "info" | "success" | "warning" | "danger";

interface LabelProps extends React.ComponentPropsWithRef<"span"> {
  tone?: LabelTone;
}

export const Label: React.FC<LabelProps> = ({ children, className, tone = "neutral", ...props }) => (
  <span className={cx(styles.label, className)} data-tone={tone} {...props}>
    <span className={styles.text}>{children}</span>
  </span>
);
