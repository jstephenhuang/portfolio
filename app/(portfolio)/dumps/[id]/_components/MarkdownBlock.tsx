"use client";

import cx from "classnames";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button, Markdown } from "@/components/ui";

import BlockWrapper from "./BlockWrapper";
import { getBlockLabel } from "./getBlockLabel";
import styles from "./styles.module.scss";

const COLLAPSED_HEIGHT = 260;

const getTextStats = (body: string) => {
  const text = body.trim();

  return {
    characters: Array.from(text).length,
    words: text ? text.split(/\s+/u).length : 0,
  };
};

interface MarkdownBlockProps {
  body: string;
  compact?: boolean;
  id: string;
  src: string;
}

interface MarkdownHeading {
  id: string;
  title: string;
}

const MarkdownBlock: React.FC<MarkdownBlockProps> = ({ body, compact = true, id, src }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const [contentHeight, setContentHeight] = useState(COLLAPSED_HEIGHT);
  const [expanded, setExpanded] = useState(false);
  const [headings, setHeadings] = useState<MarkdownHeading[]>([]);
  const canExpand = compact && contentHeight > COLLAPSED_HEIGHT + 1;
  const stats = getTextStats(body);
  const textStats = `${stats.words.toLocaleString()} words · ${stats.characters.toLocaleString()} characters`;

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const updateHeight = () => setContentHeight(content.scrollHeight);
    const observer = new ResizeObserver(updateHeight);
    const headingElements = Array.from(content.querySelectorAll<HTMLElement>("h1, h2, h3"));
    const nextHeadings = headingElements.map((heading, index) => {
      const headingId = `${id}-section-${index + 1}`;

      heading.id = headingId;

      return {
        id: headingId,
        title: heading.textContent?.trim() || `Section ${index + 1}`,
      };
    });
    const updateActiveHeading = () => {
      let activeHeading = headingElements[0];

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top > 160) break;
        activeHeading = heading;
      }

      setActiveHeadingId(activeHeading?.id ?? "");
    };

    updateHeight();
    setHeadings(nextHeadings);
    updateActiveHeading();
    observer.observe(content);
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [body, id]);

  const sectionRail = !compact && headings.length > 1 && (
    <nav className={styles.markdownSectionRail} aria-label="Article sections">
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              className={cx(styles.markdownSectionLink, activeHeadingId === heading.id && styles.active)}
              href={`#${heading.id}`}
              aria-current={activeHeadingId === heading.id ? "location" : undefined}
            >
              <span className={styles.markdownSectionLine} aria-hidden="true" />
              <span className={styles.markdownSectionTitle}>{heading.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (!compact) {
    return (
      <BlockWrapper id={id} label={getBlockLabel(src)}>
        {sectionRail}
        <p className={styles.markdownStats}>{textStats}</p>
        <div ref={contentRef}>
          <Markdown className={styles.markdownContent}>{body}</Markdown>
        </div>
      </BlockWrapper>
    );
  }

  return (
    <BlockWrapper id={id} label={getBlockLabel(src)}>
      <p className={styles.markdownStats}>{textStats}</p>
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
