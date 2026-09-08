"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Image } from "@/components/ui";
import type { Item } from "@/lib/data";

import styles from "./styles.module.scss";

interface PortfolioCardProps {
  item: Item;
}

const MotionLink = motion.create(Link);

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  return (
    <MotionLink
      className={styles.cardLink}
      href={`/dumps/${item.id}`}
      draggable={false}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
    >
      <div className={styles.card}>
        <motion.div
          className={styles.imageWrapper}
          variants={{
            rest: { opacity: 1 },
            hover: { opacity: 0.6 },
          }}
          transition={{ duration: 0.1 }}
        >
          <Image className={styles.image} src={item.image} alt={item.title} draggable={false} />
        </motion.div>
        <div className={styles.title}>{item.title}</div>
      </div>
    </MotionLink>
  );
};

export default PortfolioCard;
