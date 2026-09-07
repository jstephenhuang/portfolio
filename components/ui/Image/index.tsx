import cx from "classnames";
import NextImage, { type ImageProps } from "next/image";

import styles from "./styles.module.scss";

const DEFAULT_DIMENSION = 1000;

type Props = Omit<ImageProps, "alt"> & {
  alt?: string;
};

export const Image: React.FC<Props> = ({ className, alt = "", width, height, ...props }) => {
  const dimensionsDefined = width !== undefined && height !== undefined;
  return (
    <NextImage
      className={cx(styles.image, className)}
      alt={alt}
      width={dimensionsDefined ? width : DEFAULT_DIMENSION}
      height={dimensionsDefined ? height : DEFAULT_DIMENSION}
      {...props}
    />
  );
};
