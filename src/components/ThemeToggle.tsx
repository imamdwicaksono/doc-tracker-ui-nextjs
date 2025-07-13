import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-2 py-1 text-sm border border-gray-400 rounded cursor-pointer dark:border-gray-600"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}