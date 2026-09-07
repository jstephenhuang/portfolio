"use client";

import { Dialog as DialogPrimitive, Portal } from "@ark-ui/react";
import { XIcon } from "@phosphor-icons/react";
import cx from "classnames";
import type React from "react";

import styles from "./styles.module.scss";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.CloseTrigger;

const Content = ({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) => (
  <Portal>
    <DialogPrimitive.Backdrop className={styles.overlay} />
    <DialogPrimitive.Positioner className={styles.positioner}>
      <DialogPrimitive.Content className={cx(styles.content, className)} {...props}>
        {children}
        <DialogPrimitive.CloseTrigger className={styles.close} aria-label="Close">
          <XIcon size={16} />
        </DialogPrimitive.CloseTrigger>
      </DialogPrimitive.Content>
    </DialogPrimitive.Positioner>
  </Portal>
);

const Title = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title className={cx(styles.title, className)} {...props} />
);

const Description = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description className={cx(styles.description, className)} {...props} />
);

export { Root, Trigger, Close, Content, Title, Description };
