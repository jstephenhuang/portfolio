import { notFound } from "next/navigation";

import { Link } from "@/components/ui";
import { getDumpMetadata } from "@/lib/data/dumps";
import { isErr } from "@/lib/error";

import styles from "./styles.module.scss";

interface AdminDumpPageProps {
  params: Promise<{ id: string }>;
}

const AdminDumpPage: React.FC<AdminDumpPageProps> = async ({ params }) => {
  const { id } = await params;
  const metadataResult = await getDumpMetadata(id);

  if (isErr(metadataResult)) throw metadataResult.error;

  const item = metadataResult.data;

  if (!item) notFound();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.id}>{item.id}</span>
          <h2>{item.title}</h2>
        </div>
        <Link href={`/dumps/${item.id}`}>View project</Link>
      </header>
    </section>
  );
};

export default AdminDumpPage;
