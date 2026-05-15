import Link from "next/link";
import { Archive, Database, FileSearch, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  title,
  eyebrow,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}) {
  const localMode = !process.env.INSFORGE_URL || !process.env.INSFORGE_KEY;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#15171a]">
      <div className="grid min-h-screen lg:grid-cols-[264px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#111315] text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-white text-[#111315]">
                <Sparkles className="size-4" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">Frank</div>
                <div className="text-xs text-white/50">Expert intelligence</div>
              </div>
            </Link>
          </div>

          <nav className="space-y-1 px-3 py-4 text-sm">
            <ShellLink href="/" icon={<Database className="size-4" />}>
              Experts
            </ShellLink>
            <ShellLink href="/search" icon={<Search className="size-4" />}>
              Search
            </ShellLink>
            <ShellLink href="/experts/exp_001/enrich" icon={<Archive className="size-4" />}>
              Enrichment
            </ShellLink>
            <ShellLink href="/experts/exp_001" icon={<FileSearch className="size-4" />}>
              Demo target
            </ShellLink>
          </nav>

          <div className="mt-auto border-t border-white/10 p-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/80">
                <ShieldCheck className="size-3.5" />
                Demo status
              </div>
              <div className="text-xs leading-5 text-white/55">
                {localMode
                  ? "Running from local JSON with prepared source documents."
                  : "Connected to Insforge for expert persistence."}
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  {eyebrow ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {eyebrow}
                    </span>
                  ) : null}
                  <Badge variant="outline" className="hidden gap-1 md:inline-flex">
                    <ShieldCheck className="size-3" />
                    {localMode ? "Local demo" : "Live backend"}
                  </Badge>
                </div>
                <h1 className="truncate text-xl font-semibold tracking-tight">
                  {title}
                </h1>
              </div>
              {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

function ShellLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className="h-9 w-full justify-start gap-2 text-white/70 hover:bg-white/10 hover:text-white"
    >
      <Link href={href}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}
