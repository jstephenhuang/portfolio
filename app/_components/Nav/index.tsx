"use client";

import { EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Button, Link } from "@/components/ui";

import { useMounted } from "@mantine/hooks";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";

import cx from "classnames";
import styles from "./styles.module.scss";

const navigationItems = [
  { label: "jsh", href: "/" },
  { label: "work", href: "/work" },
  { label: "projects", href: "/projects" },
  { label: "journal", href: "/journal" },
] as const;

const getNextPhysicsValue = (value: number, direction: 1 | -1 = 1) => {
  return ((Math.round(value * 10) + direction + 11) % 11) / 10;
};

type PhysicsToggleProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const PhysicsToggle: React.FC<PhysicsToggleProps> = ({ label, value, onChange }) => {
  const controlRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const control = controlRef.current;

    if (!control) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      onChange(getNextPhysicsValue(value, event.deltaY < 0 ? 1 : -1));
    };

    control.addEventListener("wheel", handleWheel, { passive: false });

    return () => control.removeEventListener("wheel", handleWheel);
  }, [onChange, value]);

  return (
    <Button.Link
      ref={controlRef}
      className={styles.settingsControl}
      onClick={() => onChange(getNextPhysicsValue(value))}
    >
      {label} {value.toFixed(1)}
    </Button.Link>
  );
};

const ThemeToggle: React.FC = () => {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return <span>loading...</span>;

  const isDark = resolvedTheme === "dark";

  return (
    // <div className={styles.toggles}>
    //   <Button.Toggle active={!isDark} onClick={() => setTheme("light")}>
    //     light
    //   </Button.Toggle>
    //   <Button.Toggle active={isDark} onClick={() => setTheme("dark")}>
    //     dark
    //   </Button.Toggle>
    // </div>
    <Button.Link onClick={() => setTheme(isDark ? "light" : "dark")}>{isDark ? "light" : "dark"}</Button.Link>
  );
};

const LayoutToggle: React.FC = () => {
  const { isLoading, layout, setLayout } = useSettings();
  const isLocked = layout === "lock";

  if (isLoading) return <span>loading...</span>;

  return <Button.Link onClick={() => setLayout(isLocked ? "free" : "lock")}>{isLocked ? "free" : "lock"}</Button.Link>;
};

const Nav: React.FC = () => {
  const pathname = usePathname();
  const { isLoading, isSettingsOpen, friction, bounce, layout, setIsSettingsOpen, setBounce, setFriction } =
    useSettings();
  const isLocked = layout === "lock";

  return (
    <div>
      <nav className={styles.topNav}>
        <div className={styles.navigationLinks}>
          {navigationItems.map(({ href, label }) => {
            const active = pathname === href;

            return (
              <Link
                className={cx(styles.link, active && styles.activeLink)}
                href={href}
                aria-current={active ? "page" : undefined}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className={cx(styles.settings)}>
          <Button.Toggle active={isSettingsOpen} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            settings
          </Button.Toggle>
          <AnimatePresence initial={false}>
            {isSettingsOpen && (
              <motion.div
                className={cx(styles.settingsContent)}
                initial={{ height: 0, opacity: 0, y: -4 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -4, pointerEvents: "none" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ThemeToggle />
                <LayoutToggle />
                {!isLoading && !isLocked && (
                  <>
                    <PhysicsToggle label="friction" value={friction} onChange={setFriction} />
                    <PhysicsToggle label="bounce" value={bounce} onChange={setBounce} />
                  </>
                )}
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
