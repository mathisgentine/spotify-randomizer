// components/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "./mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="w-full px-4 py-6 flex items-center justify-between">
                    <button>
                    <Link href="/randomize" className="flex items-center space-x-2 group">
                        <Image
                            src="/dice.svg"
                            alt="Spotify Randomizer Logo"
                            className="h-14 w-auto transition-transform duration-700 group-hover:rotate-360 dark:invert"
                            height={100}
                            width={100}
                        />
                    </Link>
                    </button>

                    {/* Mode Toggle */}
                    <div>
                        <ModeToggle />
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-hidden flex items-center justify-center w-full">
                    {children}
                </main>

                {/* Footer */}
                <footer className="w-full px-4 py-6 bg-gray-100 dark:bg-gray-800 text-center text-sm">
                    <p>&copy; 2024 Mathis Gentine - <Link href="/legal" className="text-blue-500 hover:underline">Legal information</Link></p>
                </footer>
            </div>
        </ThemeProvider>
    );
}
