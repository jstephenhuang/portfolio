import { GitHubLogoIcon, Link2Icon, VideoIcon } from "@radix-ui/react-icons";

import { Image, Link } from "@/components/ui";
import { type Item } from "@/lib/data";

import styles from "./styles.module.scss";

interface HeaderProps {
  item: Item;
}

const Header: React.FC<HeaderProps> = ({ item }) => {
  return (
    <header className={styles.header}>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={item.firstImage} alt={item.title} priority />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{item.title}</h1>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.links}>
          {item.links.youtube && (
            <Link className={styles.link} href={item.links.youtube} target="_blank" rel="noreferrer">
              <VideoIcon className={styles.icon} />
              YouTube
            </Link>
          )}
          {item.links.github && (
            <Link className={styles.link} href={item.links.github} target="_blank" rel="noreferrer">
              <GitHubLogoIcon className={styles.icon} />
            </Link>
          )}
          {item.links.general?.map((link) => (
            <Link className={styles.link} href={link.href} target="_blank" rel="noreferrer" key={link.href}>
              <Link2Icon className={styles.icon} />
              {link.label && link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
