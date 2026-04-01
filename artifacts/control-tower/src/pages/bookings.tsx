import { useState } from "react";
import { useGetBookingFunnel, useGetRecentBookings, useGetBookingsByServiceLine } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, Stethoscope, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function BookingsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  
  const { data: funnel, isLoading: loadingFunnel } = useGetBookingFunnel({ period });
  const { data: recent, isLoading: loadingRecent } = useGetRecentBookings({ limit: 8 });
  const { data: byService, isLoading: loadingService } = useGetBookingsByServiceLine({ period });

  const formatPercent = (val?: number) => val ? `${val.toFixed(1)}%` : '0%';

  const FUNNEL_COLORS = ['#003B71', '#0073CF', '#4BA3E3', '#7BBCE8'];
  const funnelSteps = [
    { name: 'Leads', value: funnel?.leads || 0, color: FUNNEL_COLORS[0] },
    { name: 'Scheduled', value: funnel?.appointmentsScheduled || 0, color: FUNNEL_COLORS[1] },
    { name: 'Completed', value: funnel?.appointmentsCompleted || 0, color: FUNNEL_COLORS[2] },
    { name: 'Follow-ups', value: funnel?.followUps || 0, color: FUNNEL_COLORS[3] }
  ];

  const SERVICE_COLORS = ['#003B71', '#0073CF', '#4BA3E3', '#2E8B57', '#5BA88C', '#7BBCE8', '#1A5276', '#3498DB', '#48C9B0', '#85C1E9'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Patient Booking Funnel</h2>
          <p className="text-muted-foreground text-sm mt-1">End-to-end visibility of the lead-to-patient pipeline.</p>
        </div>
        <Select value={period} onValueChange={(v: string) => setPeriod(v as "7d" | "30d" | "90d")}>
          <SelectTrigger className="w-[160px] bg-white border-border">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <Card className="lg:col-span-3 bg-white border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Conversion Pipeline</CardTitle>
            <CardDescription>Volume and drop-off at each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8">
              {funnelSteps.map((step, idx) => (
                <div key={step.name} className="flex-1 w-full flex flex-col items-center">
                  <div 
                    className="w-full max-w-[200px] flex flex-col items-center justify-center p-6 relative overflow-hidden border border-border rounded-md"
                    style={{ backgroundColor: `${step.color}0A` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1 rounded-b" style={{ backgroundColor: step.color }} />
                    <span className="text-3xl font-bold font-mono tracking-tighter text-foreground mb-2">{step.value}</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{step.name}</span>
                  </div>
                  {idx < funnelSteps.length - 1 && (
                    <div className="hidden md:flex flex-col items-center my-4 md:my-0 md:absolute right-[-10%] z-10 transform translate-x-[50%]">
                      <div className="bg-white border border-border px-2 py-1 text-xs font-mono text-accent font-bold shadow-sm rounded">
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
            
            <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Overall Conv. Rate</div>
                <div className="text-2xl font-bold text-accent mt-1">{formatPercent(funnel?.overallConversionRate)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-card-border shadow-sm flex flex-col">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <CalendarCheck className="h-4 w-4 text-accent" />
              Live Booking Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
            <div className="divide-y divide-border">
              {loadingRecent ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Fetching feed...</div>
              ) : recent?.map(booking => (
                <div key={booking.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={booking.isNewPatient ? "bg-blue-50 text-accent border-blue-200 text-xs" : "bg-muted text-muted-foreground text-xs"}>
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

        <Card className="lg:col-span-4 bg-white border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Bookings by Service Line</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {loadingService ? (
                <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading service data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byService || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="serviceLineName" type="category" stroke="#374151" fontSize={12} tickLine={false} axisLine={false} width={150} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,59,113,0.04)' }}
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="totalBookings" fill="#0073CF" radius={[0, 4, 4, 0]}>
                      {byService?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
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
