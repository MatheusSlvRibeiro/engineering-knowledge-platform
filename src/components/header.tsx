import Link from "next/link";
import { ExternalLink, Layers } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex max-w-[1012px] items-center justify-between px-4 py-3 sm:px-6">
        <nav className="flex items-center gap-5">
          <Link href="/" className="text-title flex items-center gap-2">
            <Layers
              width={22}
              height={22}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <span className="text-[15px] font-semibold">
              Engineering Knowledge
            </span>
          </Link>
          <Link
            href="/"
            className="text-title hover:text-accent text-[13px] font-medium no-underline"
          >
            Skills
          </Link>
          <Link
            href="/sobre"
            className="text-title hover:text-accent text-[13px] font-medium no-underline"
          >
            Sobre
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/MatheusSlvRibeiro/harness-engineering"
            target="_blank"
            rel="noreferrer"
            className="text-fg-muted hover:text-fg hidden items-center gap-1 text-[13px] no-underline sm:inline-flex"
          >
            harness-engineering
            <ExternalLink width={12} height={12} aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
