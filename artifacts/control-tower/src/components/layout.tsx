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
  ChevronRight,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoleView } from "@/context/role-context";
import { ROLE_VIEWS, type RoleKey } from "@/lib/roles";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oncology", label: "Oncology", icon: Heart, highlight: true },
  { href: "/attribution", label: "Attribution", icon: Network },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/bookings", label: "Bookings", icon: Activity },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/departments", label: "Departments", icon: Building2 },
];

// Pages most relevant to each role — shown as priority shortcuts in the sidebar
const ROLE_PRIORITY_PAGES: Record<string, string[]> = {
  cmo:                   ["/", "/oncology", "/attribution"],
  vp_marketing:          ["/attribution", "/campaigns", "/content"],
  oncology_manager:      ["/oncology", "/departments", "/bookings"],
  cardio_oncology_manager: ["/oncology", "/bookings", "/alerts"],
  physician_liaison:     ["/oncology", "/attribution", "/departments"],
  call_center_manager:   ["/bookings", "/alerts", "/"],
  access_manager:        ["/bookings", "/departments", "/alerts"],
  cfo_partner:           ["/", "/campaigns", "/attribution"],
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { roleKey, setRoleKey } = useRoleView();

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
          {/* Role priority shortcuts */}
          <div className="mb-3">
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider flex items-center gap-1">
              <span>{roleKey.replace(/_/g, " ")} priority</span>
            </div>
            {(ROLE_PRIORITY_PAGES[roleKey] ?? []).map((href) => {
              const item = navItems.find(n => n.href === href);
              if (!item) return null;
              const isActive = location === href;
              return (
                <Link
                  key={`priority-${href}`}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 transition-colors text-xs rounded-md mb-0.5 font-medium",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent opacity-70" />
                </Link>
              );
            })}
          </div>

          <div className="px-3 mb-1.5 mt-3 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
            All Pages
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            const isPriority = (ROLE_PRIORITY_PAGES[roleKey] ?? []).includes(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 transition-colors text-sm rounded-md mb-0.5",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" 
                    : item.highlight
                    ? "text-[#0E7490] hover:bg-[#0E7490]/10"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="text-[9px] font-bold bg-[#0E7490] text-white rounded px-1 py-0.5">V2</span>
                )}
                {isPriority && !isActive && !item.highlight && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
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
              {navItems.find(i => i.href === location)?.label ?? "Dashboard"}
            </h1>
            <span className="text-muted-foreground text-sm hidden sm:inline">|</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">Sales & Marketing</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={roleKey} onValueChange={(value) => setRoleKey(value as RoleKey)}>
              <SelectTrigger className="h-8 w-[210px] bg-white text-xs">
                <SelectValue placeholder="Role view" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_VIEWS.map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
