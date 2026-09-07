import cx from "classnames";
import NextLink from "next/link";
import type React from "react";

import styles from "./styles.module.scss";

type LinkProps = React.ComponentPropsWithRef<typeof NextLink> & {
  disabled?: boolean;
};

export const Link: React.FC<LinkProps> = ({ className, disabled = false, href, tabIndex, ...props }) => {
  return (
    <NextLink
      {...props}
      href={href}
      tabIndex={disabled ? -1 : tabIndex}
      aria-disabled={disabled || undefined}
      className={cx(styles.link, disabled && styles["link--disabled"], className)}
    />
  );
};
