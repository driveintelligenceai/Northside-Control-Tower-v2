import { useListContent, useGetTopContent } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, MousePointerClick, TrendingUp, Filter } from "lucide-react";

export default function ContentPage() {
  const { data: content, isLoading: loadingContent } = useListContent();
  const { data: topContent, isLoading: loadingTop } = useGetTopContent({ period: "30d", limit: 4 });
  const safeContent = Array.isArray(content) ? content : [];
  const safeTopContent = Array.isArray(topContent) ? topContent : [];

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);
  const formatPercent = (val: number) => `${val.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Content Performance Lab
        </h2>
        <p className="text-muted-foreground">Analyze engagement and conversion metrics across all assets.</p>
      </div>

      {/* Top Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingTop ? (
          Array(4).fill(0).map((_, i) => <Card key={i} className="bg-card h-32 animate-pulse" />)
        ) : safeTopContent.map((item, i) => (
          <Card key={item.contentId} className="bg-card border-card-border hover:border-primary/50 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="text-4xl font-bold text-muted-foreground">#{i+1}</span>
            </div>
            <CardContent className="p-5">
              <Badge variant="outline" className="mb-2 bg-muted/50 text-xs capitalize">
                {item.type.replace('_', ' ')}
              </Badge>
              <div className="font-medium text-foreground line-clamp-2 min-h-[40px] text-sm">
                {item.title}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3 w-3" /> {formatNumber(item.views)}
                </div>
                <div className="text-primary font-mono font-medium">
                  {formatPercent(item.conversionRate)} CR
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Content Library */}
      <Card className="bg-card border-card-border">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <CardTitle>Asset Library</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            <Filter className="h-4 w-4" /> Filter
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="border-border">
                <TableHead>Asset Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Service Line</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Eng. Rate</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingContent ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8">Loading assets...</TableCell></TableRow>
              ) : safeContent.map(asset => (
                <TableRow key={asset.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="font-medium max-w-[250px] truncate">{asset.title}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{asset.type.replace('_', ' ')}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.serviceLineName || '-'}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{formatNumber(asset.views)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{formatNumber(asset.clicks)}</TableCell>
                  <TableCell className="text-right">{formatPercent(asset.engagementRate)}</TableCell>
                  <TableCell className="text-right font-mono text-primary font-medium">{asset.conversions}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={asset.status === 'published' ? 'default' : 'secondary'} className={asset.status === 'published' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}