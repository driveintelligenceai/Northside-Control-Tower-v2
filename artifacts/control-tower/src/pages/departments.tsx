import { useListServiceLines, useGetServiceLinePerformance } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DepartmentsPage() {
  const { data: lines, isLoading: loadingLines } = useListServiceLines();
  const { data: performance, isLoading: loadingPerf } = useGetServiceLinePerformance({ period: "30d" });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Department Performance
        </h2>
        <p className="text-muted-foreground">Compare marketing effectiveness across clinical service lines.</p>
      </div>

      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle>Cross-Department Analysis (Leads vs Bookings)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            {loadingPerf ? (
              <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance || []} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="serviceLineName" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="totalLeads" name="Total Leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalBookings" name="Total Bookings" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loadingPerf ? (
          <div className="col-span-2 text-center p-8 text-muted-foreground">Loading departments...</div>
        ) : performance?.map(dept => (
          <Card key={dept.serviceLineId} className="bg-card border-card-border">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dept.serviceLineName}</CardTitle>
                <div className={`px-2 py-1 rounded text-xs font-medium ${dept.trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {dept.trend > 0 ? '+' : ''}{dept.trend}% vs prev
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Users className="h-3 w-3" /> Leads</div>
                  <div className="font-mono text-lg font-medium">{formatNumber(dept.totalLeads)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Target className="h-3 w-3" /> Bookings</div>
                  <div className="font-mono text-lg font-medium text-accent">{formatNumber(dept.totalBookings)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Conv. Rate</div>
                  <div className="font-mono text-lg font-medium text-primary">{formatPercent(dept.conversionRate)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">CPA</div>
                  <div className="font-mono text-lg font-medium">{formatCurrency(dept.costPerAcquisition)}</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Spend: {formatCurrency(dept.totalSpend)}</span>
                <span className="font-medium">ROI: <span className="text-primary">{formatPercent(dept.roi)}</span></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}