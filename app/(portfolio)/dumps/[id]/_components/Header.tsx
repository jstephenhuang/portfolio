import ItemLinks from "@/app/_components/ItemLinks";
import { Image } from "@/components/ui";
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
        <ItemLinks links={item.links} />
      </div>
    </header>
  );
};

export default Header;
