import { 
  useGetDashboardSummary, 
  useGetDashboardTrends, 
  useListAgents, 
  useListAlerts 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowUpRight, ArrowDownRight, Users, Target, DollarSign, Brain, ShieldAlert, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
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
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="text-muted-foreground">Real-time telemetrics for Northside Hospital marketing operations.</p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Leads" 
          value={summary?.totalLeads ? formatNumber(summary.totalLeads) : "..."} 
          trend={summary?.totalLeadsTrend} 
          icon={Users} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="New Bookings" 
          value={summary?.newBookings ? formatNumber(summary.newBookings) : "..."} 
          trend={summary?.newBookingsTrend} 
          icon={Target} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="Cost Per Acquisition" 
          value={summary?.costPerAcquisition ? formatCurrency(summary.costPerAcquisition) : "..."} 
          trend={summary?.cpaTrend} 
          inverseTrend={true} // Lower is better
          icon={DollarSign} 
          loading={loadingSummary} 
        />
        <MetricCard 
          title="System ROI" 
          value={summary?.campaignROI ? formatPercent(summary.campaignROI) : "..."} 
          trend={summary?.roiTrend} 
          icon={Zap} 
          loading={loadingSummary} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-card-border overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Lead & Booking Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              {loadingTrends ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-2 w-24 bg-primary/40 rounded"></div>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                    <Area type="monotone" dataKey="bookings" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col">
          {/* Agent Health */}
          <Card className="bg-card/50 backdrop-blur-sm border-card-border flex-1">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Agent Core Health
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {summary?.activeAgents || 0} Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {loadingAgents ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Loading agents...</div>
                ) : agents?.slice(0, 3).map(agent => (
                  <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-foreground flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", agent.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-500")} />
                        {agent.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">{agent.type.replace('_', ' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-primary">{agent.accuracy}%</div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1">Accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-card/50 backdrop-blur-sm border-card-border border-l-4 border-l-destructive flex-1">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  Active Alerts
                </div>
                {summary?.criticalAlerts ? (
                  <Badge variant="destructive" className="animate-pulse">{summary.criticalAlerts} Critical</Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {loadingAlerts ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">Scanning alerts...</div>
                ) : alerts?.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground text-center">No active alerts. System nominal.</div>
                ) : alerts?.map(alert => (
                  <div key={alert.id} className="p-4 text-sm hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="font-medium text-foreground">{alert.title}</div>
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
  icon: Icon, 
  loading,
  inverseTrend = false
}: { 
  title: string; 
  value: string | number; 
  trend?: number; 
  icon: any; 
  loading?: boolean;
  inverseTrend?: boolean;
}) {
  const isPositive = trend ? trend > 0 : false;
  const isGood = inverseTrend ? !isPositive : isPositive;
  
  return (
    <Card className="bg-card border-card-border overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-muted-foreground text-sm font-medium">{title}</div>
          <div className="p-2 bg-muted/50 rounded-md">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="flex items-baseline gap-4">
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
          )}
        </div>
        
        {!loading && trend !== undefined && (
          <div className="mt-4 flex items-center text-xs font-medium">
            <span className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-sm",
              isGood ? "text-green-400 bg-green-400/10" : "text-destructive bg-destructive/10"
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