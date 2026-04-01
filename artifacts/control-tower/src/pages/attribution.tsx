import type { ElementType } from "react";
import { useGetAttribution, useListLeadSources } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, GitMerge, Fingerprint } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AttributionPage() {
  const { data: attribution, isLoading: loadingAttr } = useGetAttribution({ period: "30d" });
  const { data: sources, isLoading: loadingSources } = useListLeadSources({ period: "30d" });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  const chartData = sources?.slice(0, 5).map(source => {
    const ft = attribution?.firstTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    const lt = attribution?.lastTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    const mt = attribution?.multiTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    return { name: source.name, FirstTouch: ft, LastTouch: lt, MultiTouch: mt };
  }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Source Attribution</h2>
        <p className="text-muted-foreground text-sm mt-1">Multi-touch path analysis identifying high-value lead sources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelCard title="First Touch" description="Discovery drivers" icon={Fingerprint} data={attribution?.firstTouch} loading={loadingAttr} />
          <ModelCard title="Multi-Touch" description="Journey contributors (Linear)" icon={Network} data={attribution?.multiTouch} loading={loadingAttr} highlight />
          <ModelCard title="Last Touch" description="Conversion drivers" icon={GitMerge} data={attribution?.lastTouch} loading={loadingAttr} />
        </div>

        <Card className="lg:col-span-3 bg-white border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Model Comparison (Top 5 Sources)</CardTitle>
            <CardDescription>Conversion count variance across different attribution models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              {loadingSources || loadingAttr ? (
                <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading analysis...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,59,113,0.04)' }}
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="FirstTouch" fill="#003B71" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="MultiTouch" fill="#0073CF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="LastTouch" fill="#4BA3E3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-white border-card-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Lead Source Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-foreground font-semibold">Source</TableHead>
                    <TableHead className="text-foreground font-semibold">Category</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Total Leads</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Conversions</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Win Rate</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">Spend</TableHead>
                    <TableHead className="text-right text-foreground font-semibold">CPL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSources ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground animate-pulse">Loading sources...</TableCell>
                    </TableRow>
                  ) : sources?.map(source => (
                    <TableRow key={source.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-foreground">{source.name}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{source.category.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right font-mono">{source.totalLeads}</TableCell>
                      <TableCell className="text-right font-mono text-accent font-semibold">{source.convertedLeads}</TableCell>
                      <TableCell className="text-right">{formatPercent(source.conversionRate)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(source.totalSpend)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(source.costPerLead)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModelCard({ title, description, icon: Icon, data, loading, highlight = false }: { title: string; description: string; icon: ElementType; data?: Array<{ sourceName: string; percentage: number; conversions: number; revenue: number }>; loading: boolean; highlight?: boolean }) {
  const topSource = data?.[0];

  return (
    <Card className={`bg-white border-card-border shadow-sm ${highlight ? 'border-accent ring-1 ring-accent/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
          <Icon className={`h-4 w-4 ${highlight ? 'text-accent' : ''}`} />
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-12 flex items-center text-sm text-muted-foreground">Calculating...</div>
        ) : topSource ? (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Top Performer</div>
            <div className="text-base font-semibold text-foreground flex items-center justify-between">
              {topSource.sourceName}
              <span className={`text-sm font-mono font-bold ${highlight ? 'text-accent' : 'text-primary'}`}>
                {topSource.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex justify-between">
              <span>{topSource.conversions} conversions</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(topSource.revenue)}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}
