// contexts/ThemeProvider.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function AppThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
}
