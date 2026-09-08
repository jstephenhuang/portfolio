import "katex/dist/katex.min.css";
import "@/styles/globals.scss";
import cx from "classnames";
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "jsh",
  description: "jsh | portfolio",
};

const RootLayout: React.FC<Readonly<React.PropsWithChildren>> = ({ children }) => {
  return (
    <html lang="en" className={cx(spaceGrotesk.variable, jetBrainsMono.variable)} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
