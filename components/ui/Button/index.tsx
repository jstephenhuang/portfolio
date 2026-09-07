import cx from "classnames";
import type React from "react";

import { Spinner } from "../Spinner";
import styles from "./styles.module.scss";

interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  isLoading?: boolean;
  align?: "left" | "center" | "right";
}

interface ToggleButtonProps extends ButtonProps {
  active: boolean;
}

const ButtonBase = ({
  children,
  type = "button",
  isLoading,
  disabled,
  className,
  align = "center",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={cx(className, isLoading && styles["loading-root"])}
    {...props}
  >
    <span
      className={cx(
        styles["label-slot"],
        styles[`label-slot--align-${align}`],
        isLoading && styles["label-slot--hidden"]
      )}
    >
      {children}
    </span>
    {isLoading && (
      <span className={styles["loading-overlay"]} aria-hidden>
        <Spinner size={16} />
      </span>
    )}
  </button>
);

const PrimaryButton = ({ children, className, ...props }: ButtonProps) => (
  <ButtonBase {...props} className={cx(styles.primary, className)}>
    {children}
  </ButtonBase>
);

const SecondaryButton = ({ children, className, ...props }: ButtonProps) => (
  <ButtonBase {...props} className={cx(styles.secondary, className)}>
    {children}
  </ButtonBase>
);

const LinkButton = ({ children, className, align = "left", ...props }: ButtonProps) => (
  <ButtonBase {...props} align={align} className={cx(styles.link, className)}>
    {children}
  </ButtonBase>
);

const ToggleButton: React.FC<ToggleButtonProps> = ({ children, active, className, align = "left", ...props }) => (
  <ButtonBase
    {...props}
    align={align}
    aria-pressed={active}
    className={cx(styles.link, active && styles["toggle--active"], className)}
  >
    {children}
  </ButtonBase>
);

export { PrimaryButton as Primary, SecondaryButton as Secondary, LinkButton as Link, ToggleButton as Toggle };
