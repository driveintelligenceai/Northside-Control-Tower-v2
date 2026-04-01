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
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/attribution", label: "Attribution", icon: Network },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/bookings", label: "Bookings", icon: Activity },
  { href: "/content", label: "Content Lab", icon: FileText },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/departments", label: "Departments", icon: Building2 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <img
              src="https://www.northside.com/src/assets/img/NH_Logo_Navy_2021.svg"
              alt="Northside Hospital"
              className="h-6 w-auto brightness-0 invert"
            />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Control Tower</span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Control Tower
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 transition-colors text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">
              {navItems.find(i => i.href === location)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 border border-border">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System Active
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent/10">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-background relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}