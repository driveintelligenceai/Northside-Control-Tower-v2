import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  LayoutDashboard, 
  Megaphone, 
  Network, 
  FileText, 
  Bot, 
  AlertTriangle, 
  Building2,
  Settings,
  Bell,
  Activity,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/attribution", label: "Attribution", icon: Network },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/bookings", label: "Bookings", icon: Activity },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/departments", label: "Departments", icon: Building2 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <aside className="w-60 border-r border-sidebar-border bg-sidebar flex flex-col hidden md:flex shrink-0">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <img
            src="https://www.northside.com/src/assets/img/NH_Logo_Navy_2021.svg"
            alt="Northside Hospital"
            className="h-10 w-auto brightness-0 invert"
          />
        </div>
        
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="px-3 mb-3 text-[11px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
            Marketing Analytics
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 transition-colors text-sm rounded-md mb-0.5",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2.5 transition-colors text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer rounded-md">
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">
              {navItems.find(i => i.href === location)?.label || "Dashboard"}
            </h1>
            <span className="text-muted-foreground text-sm hidden sm:inline">|</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">Sales & Marketing</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-md bg-background">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
