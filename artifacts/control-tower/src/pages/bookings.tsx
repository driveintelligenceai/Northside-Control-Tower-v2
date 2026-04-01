import { useState } from "react";
import { useGetBookingFunnel, useGetRecentBookings, useGetBookingsByServiceLine } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, UserPlus, CalendarCheck, CalendarX, Stethoscope, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function BookingsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  
  const { data: funnel, isLoading: loadingFunnel } = useGetBookingFunnel({ period });
  const { data: recent, isLoading: loadingRecent } = useGetRecentBookings({ limit: 8 });
  const { data: byService, isLoading: loadingService } = useGetBookingsByServiceLine({ period });

  const formatPercent = (val?: number) => val ? `${val.toFixed(1)}%` : '0%';

  const funnelSteps = [
    { name: 'Leads', value: funnel?.leads || 0, color: 'hsl(var(--muted-foreground))' },
    { name: 'Scheduled', value: funnel?.appointmentsScheduled || 0, color: 'hsl(var(--primary))' },
    { name: 'Completed', value: funnel?.appointmentsCompleted || 0, color: 'hsl(var(--accent))' },
    { name: 'Follow-ups', value: funnel?.followUps || 0, color: 'hsl(var(--chart-3))' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Patient Booking Funnel
          </h2>
          <p className="text-muted-foreground">End-to-end visibility of the lead-to-patient pipeline.</p>
        </div>
        <Select value={period} onValueChange={(v: string) => setPeriod(v as "7d" | "30d" | "90d")}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Funnel Vis */}
        <Card className="lg:col-span-3 bg-card border-card-border">
          <CardHeader>
            <CardTitle>Conversion Pipeline</CardTitle>
            <CardDescription>Volume and drop-off at each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
              {funnelSteps.map((step, idx) => (
                <div key={step.name} className="flex-1 w-full flex flex-col items-center">
                  <div 
                    className="w-full max-w-[200px] flex flex-col items-center justify-center rounded-lg p-6 relative overflow-hidden border border-border/50"
                    style={{ backgroundColor: `${step.color}15` }} // 15 is hex for ~8% opacity
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: step.color }} />
                    <span className="text-4xl font-bold font-mono tracking-tighter text-foreground mb-2">{step.value}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{step.name}</span>
                  </div>
                  {idx < funnelSteps.length - 1 && (
                    <div className="hidden md:flex flex-col items-center my-4 md:my-0 md:absolute right-[-10%] z-10 transform translate-x-[50%]">
                      <div className="bg-background border border-border rounded-full px-2 py-1 text-xs font-mono text-primary font-bold shadow-sm">
                        {idx === 0 ? formatPercent(funnel?.leadsToScheduledRate) : 
                         idx === 1 ? formatPercent(funnel?.scheduledToCompletedRate) : 
                         formatPercent(funnel?.completedToFollowUpRate)}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Overall Conv. Rate</div>
                <div className="text-2xl font-bold text-accent mt-1">{formatPercent(funnel?.overallConversionRate)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Feed */}
        <Card className="bg-card border-card-border flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Live Booking Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
            <div className="divide-y divide-border/50">
              {loadingRecent ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Fetching feed...</div>
              ) : recent?.map(booking => (
                <div key={booking.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={booking.isNewPatient ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                      {booking.isNewPatient ? "New" : "Returning"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="font-medium text-sm text-foreground flex items-center gap-2">
                    <Stethoscope className="h-3 w-3 text-primary" />
                    {booking.serviceLineName}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>Source: {booking.leadSourceName || 'Unknown'}</span>
                    <span className="font-mono">{new Date(booking.appointmentDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Line Chart */}
        <Card className="lg:col-span-4 bg-card border-card-border">
          <CardHeader>
            <CardTitle>Bookings by Service Line</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {loadingService ? (
                <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading service data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byService || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="serviceLineName" type="category" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} width={150} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar dataKey="totalBookings" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                      {byService?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}