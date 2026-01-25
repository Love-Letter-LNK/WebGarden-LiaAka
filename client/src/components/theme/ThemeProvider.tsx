import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={["pink", "blue"]}
      defaultTheme="pink"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
