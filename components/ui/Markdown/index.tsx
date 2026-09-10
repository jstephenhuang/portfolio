import cx from "classnames";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Image } from "../Image";
import { Link } from "../Link";
import { MarkdownCodeBlock } from "../MarkdownCodeBlock";
import styles from "./styles.module.scss";

type MarkdownImageProps = React.ComponentProps<"img"> & ExtraProps;
type MarkdownLinkProps = React.ComponentProps<"a"> & ExtraProps;
type MarkdownPreProps = React.ComponentProps<"pre"> & ExtraProps;

interface MarkdownProps {
  children: string;
  className?: string;
}

const MarkdownImage: React.FC<MarkdownImageProps> = ({ alt = "", node: _node, src, title }) => {
  if (typeof src !== "string" || !src) return null;

  return (
    <span className={styles.figure}>
      <Image
        className={styles.image}
        src={src}
        alt={alt}
        title={title}
        sizes="(max-width: 768px) calc(100vw - 32px), 760px"
        unoptimized={src.startsWith("http://") || src.startsWith("https://")}
      />
      {title && <span className={styles.caption}>{title}</span>}
    </span>
  );
};

const MarkdownLink: React.FC<MarkdownLinkProps> = ({ children, href = "", node: _node, ...props }) => {
  const external = href.startsWith("http://") || href.startsWith("https://");

  return (
    <Link {...props} href={href} target={external ? "_blank" : props.target} rel={external ? "noreferrer" : props.rel}>
      {children}
    </Link>
  );
};

const MarkdownPre: React.FC<MarkdownPreProps> = ({ node: _node, ...props }) => <MarkdownCodeBlock {...props} />;

const components: Components = {
  a: MarkdownLink,
  img: MarkdownImage,
  pre: MarkdownPre,
};

export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  return (
    <article className={cx(styles.markdown, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, [rehypeHighlight, { detect: true }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
};
