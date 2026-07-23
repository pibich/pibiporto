import Link from "next/link";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#skills", label: "skills" },
  { href: "/#projects", label: "projects" },
  { href: "/#youtube", label: "youtube" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between px-7">
        <Link
          href="/#hero"
          className="font-mono text-sm font-semibold text-ink"
        >
          <span className="text-acc">~/</span>vincent-bryan
        </Link>
        <div className="flex items-center gap-[26px]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="rounded-md bg-acc px-[14px] py-[7px] font-mono text-[12.5px] font-semibold text-bg transition-opacity hover:opacity-85"
          >
            contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
