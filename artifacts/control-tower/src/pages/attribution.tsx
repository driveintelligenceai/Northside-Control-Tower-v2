import { useGetAttribution, useListLeadSources } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, GitMerge, Fingerprint, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AttributionPage() {
  const { data: attribution, isLoading: loadingAttr } = useGetAttribution({ period: "30d" });
  const { data: sources, isLoading: loadingSources } = useListLeadSources({ period: "30d" });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  // Prepare chart data comparing models
  const chartData = sources?.slice(0, 5).map(source => {
    const ft = attribution?.firstTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    const lt = attribution?.lastTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    const mt = attribution?.multiTouch.find(a => a.sourceName === source.name)?.conversions || 0;
    return { name: source.name, FirstTouch: ft, LastTouch: lt, MultiTouch: mt };
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8 text-primary" />
          Source Attribution
        </h2>
        <p className="text-muted-foreground">Multi-touch path analysis identifying high-value lead sources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Models comparison overview */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelCard title="First Touch" description="Discovery drivers" icon={Fingerprint} data={attribution?.firstTouch} loading={loadingAttr} />
          <ModelCard title="Multi-Touch" description="Journey contributors (Linear)" icon={Network} data={attribution?.multiTouch} loading={loadingAttr} highlight />
          <ModelCard title="Last Touch" description="Conversion drivers" icon={GitMerge} data={attribution?.lastTouch} loading={loadingAttr} />
        </div>

        {/* Chart */}
        <Card className="lg:col-span-3 bg-card border-card-border">
          <CardHeader>
            <CardTitle>Model Comparison (Top 5 Sources)</CardTitle>
            <CardDescription>Conversion count variance across different attribution models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              {loadingSources || loadingAttr ? (
                <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading analysis...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="FirstTouch" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="MultiTouch" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="LastTouch" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Source Table */}
        <Card className="lg:col-span-3 bg-card border-card-border">
          <CardHeader>
            <CardTitle>Lead Source Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total Leads</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">CPL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingSources ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground animate-pulse">Loading sources...</TableCell>
                    </TableRow>
                  ) : sources?.map(source => (
                    <TableRow key={source.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{source.category.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right font-mono">{source.totalLeads}</TableCell>
                      <TableCell className="text-right font-mono text-primary">{source.convertedLeads}</TableCell>
                      <TableCell className="text-right">{formatPercent(source.conversionRate)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(source.totalSpend)}</TableCell>
                      <TableCell className="text-right font-mono text-accent">{formatCurrency(source.costPerLead)}</TableCell>
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

function ModelCard({ title, description, icon: Icon, data, loading, highlight = false }: any) {
  const topSource = data?.[0];

  return (
    <Card className={`border-card-border ${highlight ? 'border-primary/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-primary/5' : 'bg-card'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : ''}`} />
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-12 flex items-center text-sm text-muted-foreground">Calculating...</div>
        ) : topSource ? (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Top Performer</div>
            <div className="text-lg font-semibold text-foreground flex items-center justify-between">
              {topSource.sourceName}
              <span className={`text-sm font-mono ${highlight ? 'text-primary' : 'text-accent'}`}>
                {topSource.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
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