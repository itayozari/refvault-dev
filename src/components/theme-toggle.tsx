import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Update DOM
    document.documentElement.classList.toggle('dark', newIsDark);
    
    // Save preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
      )}
    </button>
  );
} 