import { Link } from "@/components/ui";
import { getAllDumpMetadata } from "@/lib/data/dumps";
import { isErr } from "@/lib/error";

import styles from "./styles.module.scss";

const AdminPage: React.FC = async () => {
  const metadataResult = await getAllDumpMetadata();

  if (isErr(metadataResult)) throw metadataResult.error;

  return (
    <section className={styles.section}>
      <h2>Items</h2>
      <ul className={styles.list}>
        {metadataResult.data.map((item) => (
          <li key={item.id} className={styles.item}>
            <div>
              <h3>{item.title}</h3>
              <span className={styles.id}>{item.id}</span>
            </div>
            <div className={styles.actions}>
              <Link href={`/admin/dumps/${item.id}`}>Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPage;
