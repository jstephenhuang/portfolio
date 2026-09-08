"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button, Markdown } from "@/components/ui";

import BlockWrapper from "./BlockWrapper";
import { getBlockLabel } from "./getBlockLabel";
import styles from "./styles.module.scss";

const COLLAPSED_HEIGHT = 260;

interface MarkdownBlockProps {
  body: string;
  compact?: boolean;
  id: string;
  src: string;
}

const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ body, compact = true, id, src }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(COLLAPSED_HEIGHT);
  const [expanded, setExpanded] = useState(false);
  const canExpand = compact && contentHeight > COLLAPSED_HEIGHT + 1;

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const updateHeight = () => setContentHeight(content.scrollHeight);
    const observer = new ResizeObserver(updateHeight);

    updateHeight();
    observer.observe(content);

    return () => observer.disconnect();
  }, [compact]);

  if (!compact) {
    return (
      <BlockWrapper id={id} label={getBlockLabel(src)}>
        <Markdown className={styles.markdownContent}>{body}</Markdown>
      </BlockWrapper>
    );
  }

  return (
    <BlockWrapper id={id} label={getBlockLabel(src)}>
      <motion.div
        className={styles.markdownViewport}
        id={`${id}-content`}
        animate={{ height: expanded ? contentHeight : Math.min(contentHeight, COLLAPSED_HEIGHT) }}
        initial={false}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div ref={contentRef}>
          <Markdown className={styles.markdownContent}>{body}</Markdown>
        </div>
        {canExpand && !expanded && <span className={styles.markdownFade} aria-hidden="true" />}
      </motion.div>
      {canExpand && (
        <Button.Link
          className={styles.markdownToggle}
          type="button"
          aria-controls={`${id}-content`}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button.Link>
      )}
    </BlockWrapper>
  );
};

export default MarkdownBlock;
