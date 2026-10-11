"use client";

import { useMounted } from "@mantine/hooks";
import { EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { Button, Link } from "@/components/ui";

import styles from "./styles.module.scss";
import { useSettings } from "../contexts/SettingsContext";

const THEME_TRANSITION_DURATION = 240;

const ThemeToggle: React.FC = () => {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== null) window.clearTimeout(transitionTimeoutRef.current);
      document.documentElement.classList.remove("theme-transition");
    },
    []
  );

  if (!mounted) return <span>loading...</span>;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const root = document.documentElement;

    if (transitionTimeoutRef.current !== null) window.clearTimeout(transitionTimeoutRef.current);

    root.classList.add("theme-transition");
    setTheme(isDark ? "light" : "dark");
    transitionTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionTimeoutRef.current = null;
    }, THEME_TRANSITION_DURATION);
  };

  return (
    // <div className={styles.toggles}>
    //   <Button.Toggle active={!isDark} onClick={() => setTheme("light")}>
    //     light
    //   </Button.Toggle>
    //   <Button.Toggle active={isDark} onClick={() => setTheme("dark")}>
    //     dark
    //   </Button.Toggle>
    // </div>
    <Button.Link onClick={toggleTheme}>{isDark ? "light" : "dark"}</Button.Link>
  );
};

const Nav: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();

  return (
    <div>
      <nav className={styles.topNav}>
        <div className={styles.settings}>
          <Button.Toggle active={isSettingsOpen} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            settings
          </Button.Toggle>
          <AnimatePresence initial={false}>
            {isSettingsOpen && (
              <motion.div
                className={styles.settingsContent}
                initial={{ height: 0, opacity: 0, y: -4 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -4, pointerEvents: "none" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ThemeToggle />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <nav className={styles.botNav}>
        <Link className={styles.link} href="tel:5148368531">
          514 836 8531
        </Link>
        <Link className={styles.link} href={"mailto:jstephhuang@gmail.com"}>
          <EnvelopeClosedIcon className={styles.icon} />
        </Link>
        <Link className={styles.link} href="https://linkedin.com/in/jstephenhuang">
          <LinkedInLogoIcon className={styles.icon} />
        </Link>
        <Link className={styles.link} href="https://github.com/jstephenhuang">
          <GitHubLogoIcon className={styles.icon} />
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
