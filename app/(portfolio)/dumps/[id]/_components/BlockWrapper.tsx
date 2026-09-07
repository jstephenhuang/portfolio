import cx from "classnames";

import { Label } from "@/components/ui";

import styles from "./styles.module.scss";

interface BlockWrapperProps extends React.ComponentPropsWithRef<"section"> {
  label: string;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ children, className, label, ...props }) => (
  <section className={cx(styles.block, className)} {...props}>
    <Label tone="info">
      <span className={styles.blockLabel}>{label}</span>
    </Label>
    {children}
  </section>
);

export default BlockWrapper;
