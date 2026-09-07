"use client";

import { CircleNotchIcon } from "@phosphor-icons/react";
import cx from "classnames";

import styles from "./styles.module.scss";

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

const Spinner = ({ size = 16, className, label = "Loading" }: SpinnerProps) => (
  <CircleNotchIcon
    size={size}
    weight="bold"
    role="status"
    aria-label={label}
    className={cx(styles.spinner, className)}
  />
);

export { Spinner };
