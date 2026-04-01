import type { ElementType } from "react";
import { 
  useGetDashboardSummary, 
  useGetDashboardTrends, 
  useListAgents, 
  useListAlerts 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Users, Target, DollarSign, Zap, Brain, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useRoleView } from "@/context/role-context";
import { KpiTrustBadge } from "@/components/kpi-trust-badge";

export default function DashboardPage() {
  const { role } = useRoleView();
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({ period: "30d" });
  const { data: trends, isLoading: loadingTrends } = useGetDashboardTrends({ period: "30d" });
  const { data: agents, isLoading: loadingAgents } = useListAgents();
  const { data: alerts, isLoading: loadingAlerts } = useListAlerts({ limit: 5 });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const chartData = trends?.dates.map((date, i) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: trends.leads[i],
    bookings: trends.bookings[i]
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Marketing Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">30-day performance summary for Northside Hospital marketing operations.</p>
        <p className="text-xs text-accent mt-2">
          {role.label} focus: {role.focus}
        </p>
      </div>

      <Card className="bg-white border-card-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Role-Based KPI Priorities</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            {role.primaryKpis.map((kpi) => (
              <div key={kpi} className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-foreground">
                {kpi}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Leads" 
          value={summary?.totalLeads ? formatNumber(summary.totalLeads) : "..."} 
          trend={summary?.totalLeadsTrend} 
          metricKey="dashboard.totalLeads"
          icon={Users} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="New Bookings" 
          value={summary?.newBookings ? formatNumber(summary.newBookings) : "..."} 
          trend={summary?.newBookingsTrend} 
          metricKey="dashboard.newBookings"
          icon={Target} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="Cost Per Acquisition" 
          value={summary?.costPerAcquisition ? formatCurrency(summary.costPerAcquisition) : "..."} 
          trend={summary?.cpaTrend} 
          inverseTrend={true}
          metricKey="dashboard.cpa"
          icon={DollarSign} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="System ROI" 
          value={summary?.campaignROI ? formatPercent(summary.campaignROI) : "..."} 
          trend={summary?.roiTrend} 
          metricKey="dashboard.roi"
          icon={Zap} 
          loading={loadingSummary} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 bg-white border-card-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Lead & Booking Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              {loadingTrends ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground text-sm">Loading trends...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003B71" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#003B71" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0073CF" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#0073CF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#1F2937' }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#003B71" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
                    <Area type="monotone" dataKey="bookings" stroke="#0073CF" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5 flex flex-col">
          <Card className="bg-white border-card-border shadow-sm flex-1">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  Agent Health
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium text-xs">
                  {summary?.activeAgents || 0} Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {loadingAgents ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Loading agents...</div>
                ) : agents?.slice(0, 3).map(agent => (
                  <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-foreground flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", agent.status === "active" ? "bg-green-500" : "bg-amber-400")} />
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{agent.type.replace('_', ' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-semibold text-accent">{agent.accuracy}%</div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-card-border shadow-sm border-l-4 border-l-destructive flex-1">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  Active Alerts
                </div>
                {summary?.criticalAlerts ? (
                  <Badge variant="destructive" className="text-xs">{summary.criticalAlerts} Critical</Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {loadingAlerts ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Scanning alerts...</div>
                ) : alerts?.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground text-center">No active alerts.</div>
                ) : alerts?.map(alert => (
                  <div key={alert.id} className="p-4 text-sm hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="font-medium text-foreground text-sm">{alert.title}</div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mt-1 line-clamp-1">{alert.message}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  trend, 
  metricKey,
  icon: Icon, 
  loading,
  inverseTrend = false
}: { 
  title: string; 
  value: string | number; 
  trend?: number; 
  metricKey: string;
  icon: ElementType; 
  loading?: boolean;
  inverseTrend?: boolean;
}) {
  const isPositive = trend ? trend > 0 : false;
  const isGood = inverseTrend ? !isPositive : isPositive;
  
  return (
    <Card className="bg-white border-card-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="text-muted-foreground text-sm">{title}</div>
          <div className="flex items-center gap-2">
            <KpiTrustBadge metricKey={metricKey} />
            <div className="p-2 bg-primary/5 rounded-md">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-4">
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
          )}
        </div>
        
        {!loading && trend !== undefined && (
          <div className="mt-3 flex items-center text-xs font-medium">
            <span className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded",
              isGood ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
            )}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground ml-2">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
