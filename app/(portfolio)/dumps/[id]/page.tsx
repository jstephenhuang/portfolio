import { notFound } from "next/navigation";

import { getDumpLogs, getDumpMetadata } from "@/lib/data/dumps";
import { isErr } from "@/lib/error";

import { Header, ImageBlock, MarkdownBlock, VideoBlock } from "./_components";
import styles from "./styles.module.scss";

interface DumpPageProps {
  params: Promise<{ id: string }>;
}

const DumpPage: React.FC<DumpPageProps> = async ({ params }) => {
  const { id } = await params;
  const metadataResult = await getDumpMetadata(id);

  if (isErr(metadataResult)) throw metadataResult.error;

  const metadata = metadataResult.data;

  if (!metadata) notFound();

  const logsResult = await getDumpLogs(metadata);

  if (isErr(logsResult)) throw logsResult.error;

  return (
    <main className={styles.page}>
      <Header item={metadata} />
      {logsResult.data.length > 0 && (
        <section className={styles.log} aria-label={`${metadata.title} log`}>
          {logsResult.data.map((entry) => {
            const entryId = `log-${entry.date.replaceAll("/", "-")}`;

            return (
              <section className={styles.logEntry} id={entryId} key={entry.date}>
                <time className={styles.logDate} dateTime={entry.date.replaceAll("/", "-")}>
                  {entry.date}
                </time>
                <div className={styles.logContent}>
                  {entry.blocks.map((block, index) => {
                    const blockId = `${entryId}-${block.type}-${index + 1}`;

                    if (block.type === "markdown") {
                      return (
                        <MarkdownBlock
                          body={block.body}
                          compact={block.compact}
                          id={blockId}
                          src={block.src}
                          key={blockId}
                        />
                      );
                    }

                    if (block.type === "image") {
                      return <ImageBlock block={block} id={blockId} key={blockId} />;
                    }

                    return <VideoBlock block={block} id={blockId} key={blockId} />;
                  })}
                </div>
              </section>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default DumpPage;
