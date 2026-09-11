import { GitHubLogoIcon, Link2Icon, VideoIcon } from "@radix-ui/react-icons";

import { Link } from "@/components/ui";
import type { Item } from "@/lib/data";

import styles from "./styles.module.scss";

interface ItemLinksProps {
  links: Item["links"];
}

const ItemLinks: React.FC<ItemLinksProps> = ({ links }) => {
  if (!links.youtube && !links.github && !links.general?.length) return null;

  return (
    <div className={styles.links}>
      {links.youtube && (
        <Link className={styles.link} href={links.youtube} target="_blank" rel="noreferrer">
          <VideoIcon className={styles.icon} />
          YouTube
        </Link>
      )}
      {links.github && (
        <Link className={styles.link} href={links.github} target="_blank" rel="noreferrer">
          <GitHubLogoIcon className={styles.icon} />
        </Link>
      )}
      {links.general?.map((link) => (
        <Link className={styles.link} href={link.href} target="_blank" rel="noreferrer" key={link.href}>
          <Link2Icon className={styles.icon} />
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default ItemLinks;
