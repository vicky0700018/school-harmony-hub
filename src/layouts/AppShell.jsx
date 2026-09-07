import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useApp } from "@/context/AppContext";
import { navForRole } from "@/data/nav";
import { cn } from "@/lib/utils";
import { initials } from "@/utils/format";

function Icon({ name, className }) {
  const C = Icons[name] || Icons.Circle;
  return <C className={className} />;
}

function GlobalSearch({ onPick }) {
  const { students } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (n.length < 2) return [];
    return students
      .filter((s) =>
        [s.name, s.admissionNo, s.fatherName, s.mobile, s.className, s.rollNo]
          .map((v) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(n)),
      )
      .slice(0, 8);
  }, [q, students]);

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search students by name, admission no, mobile…"
        className="h-9 w-full rounded-lg border border-input bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
      {open && results.length > 0 && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
          {results.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setOpen(false);
                setQ("");
                onPick(s);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {initials(s.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm">{s.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {s.admissionNo} · Class {s.className}-{s.section} · {s.mobile}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarNav({ collapsed, onNavigate, pathname }) {
  const { user } = useApp();
  const groups = useMemo(() => navForRole(user?.role || "Admin"), [user]);
  const active = pathname.replace(/^\/app\/?/, "");
  const [open, setOpen] = useState(() => {
    const o = {};
    groups.forEach((g) =>
      g.items.forEach((i) => {
        if (active === i.slug || active.startsWith(i.slug + "/")) o[i.slug] = true;
      }),
    );
    return o;
  });

  return (
    <nav className="space-y-5 px-3 pb-8">
      {groups.map((g) => (
        <div key={g.group}>
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {g.group}
            </p>
          )}
          <div className="space-y-1">
            {g.items.map((item) => {
              const isActive = active === item.slug || active.startsWith(item.slug + "/");
              if (!item.children) {
                return (
                  <Link
                    key={item.slug}
                    to="/app/$"
                    params={{ _splat: item.slug }}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-sidebar-foreground hover:bg-accent",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              }
              const expanded = collapsed ? false : open[item.slug];
              return (
                <div key={item.slug}>
                  <button
                    onClick={() => setOpen((o) => ({ ...o, [item.slug]: !o[item.slug] }))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-sidebar-foreground hover:bg-accent",
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <Icons.ChevronRight
                          className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")}
                        />
                      </>
                    )}
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-300",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0">
                      <div className="ml-6 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                        {item.children.map((c) => (
                          <Link
                            key={c.slug}
                            to="/app/$"
                            params={{ _splat: c.slug }}
                            onClick={onNavigate}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-[13px] transition-colors",
                              active === c.slug
                                ? "bg-accent font-medium text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AppShell({ children }) {
  const { user, logout, settings, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openStudent = (s) =>
    navigate({ to: "/app/$", params: { _splat: `students/profile/${s.id}` } });

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
          {settings.logoText || "S"}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold">{settings.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{settings.tagline}</p>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pt-4">
        <SidebarNav collapsed={collapsed} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden items-center gap-2 border-t border-sidebar-border px-4 py-3 text-xs text-muted-foreground hover:bg-accent lg:flex"
      >
        <Icons.PanelLeft className="h-4 w-4" />
        {!collapsed && "Collapse sidebar"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border transition-all duration-300 lg:block",
          collapsed ? "w-[74px]" : "w-64",
        )}
      >
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-in slide-in-from-left border-r border-sidebar-border">
            {sidebar}
          </aside>
        </div>
      )}

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[74px]" : "lg:pl-64")}>
        <header className="no-print sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <button
            className="rounded-lg p-2 hover:bg-accent lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
          <GlobalSearch onPick={openStudent} />
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-accent" aria-label="Toggle theme">
              {theme === "dark" ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-accent"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
                  {initials(user?.name)}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-medium leading-tight">{user?.name}</span>
                  <span className="block text-[10px] leading-tight text-muted-foreground">
                    {user?.role}
                  </span>
                </span>
                <Icons.ChevronDown className="h-3.5 w-3.5" />
              </button>
              {menu && (
                <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      setMenu(false);
                      navigate({ to: "/app/$", params: { _splat: "settings/school" } });
                    }}
                  >
                    <Icons.Settings className="h-4 w-4" /> School settings
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                    onClick={() => {
                      logout();
                      navigate({ to: "/" });
                    }}
                  >
                    <Icons.LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
