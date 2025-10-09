import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { VocabProvider } from '@/components/providers/VocabProvider';

const inter = Inter({ subsets: ['latin', 'thai'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'JLPT Vocabulary Trainer',
  description: 'JLPT N5-N3 vocabulary trainer with Leitner SRS and mistake tracking.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-sakura text-midnight`}> 
        <VocabProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-moss bg-white/80 backdrop-blur">
              <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
                <Link href="/" className="text-xl font-semibold text-midnight">
                  JLPT Vocab Trainer
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                  <Link className="hover:text-sky" href="/quiz">
                    Quiz
                  </Link>
                  <Link className="hover:text-sky" href="/review">
                    Review
                  </Link>
                  <Link className="hover:text-sky" href="/my-vocab">
                    My Vocab
                  </Link>
                  <Link className="hover:text-sky" href="/stats">
                    Stats
                  </Link>
                  <Link className="hover:text-sky" href="/settings">
                    Settings
                  </Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
            <footer className="border-t border-moss bg-white/80 px-4 py-4 text-center text-xs text-moss">
              © {new Date().getFullYear()} JLPT Vocabulary Trainer
            </footer>
          </div>
        </VocabProvider>
      </body>
    </html>
  );
}
