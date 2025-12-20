import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "../app/providers"; // wraps with Redux, theme, etc.

export const metadata: Metadata = {
  title: "Perfume Kart",
  description: "The perfect place for perfumes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
