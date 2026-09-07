"use client";

import cx from "classnames";
import type React from "react";
import { get, useFormContext, type RegisterOptions } from "react-hook-form";

import { ErrorText } from "../ErrorText";
import styles from "./styles.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  registerOptions?: RegisterOptions;
  showError?: boolean;
  containerClassName?: string;
  fullWidth?: boolean;
}

const TextInput: React.FC<Props> = ({
  className,
  fullWidth,
  name,
  id,
  registerOptions,
  showError = true,
  containerClassName,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);

  return (
    <div
      className={cx(
        styles["container"],
        { [styles["container--full-width"]]: fullWidth },
        containerClassName
      )}
    >
      <input
        id={id ?? name}
        className={cx(styles["text-input"], className, {
          [styles["text-input--error"]]: !!error,
        })}
        {...props}
        {...register(name, registerOptions)}
      />
      {showError && error && <ErrorText message={error?.message} />}
    </div>
  );
};

export { TextInput };
