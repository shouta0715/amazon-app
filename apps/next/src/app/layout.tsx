import "@/styles/globals.css";
import { NextSegmentLayout } from "next";

const RootLayout: NextSegmentLayout = ({ children }) => (
  <html suppressHydrationWarning lang="ja">
    <body>{children}</body>
  </html>
);

export default RootLayout;
