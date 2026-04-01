import { useState } from "react";
import { useListAlerts, useGetAlertsSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ShieldAlert, AlertCircle, CheckCircle2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  
  const { data: summary, isLoading: loadingSummary } = useGetAlertsSummary();
  const { data: alerts, isLoading: loadingAlerts } = useListAlerts({ severity: filter === "all" ? undefined : filter });

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-primary" />;
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'critical': return "bg-destructive/10 border-destructive/20 text-destructive";
      case 'warning': return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
      case 'info': return "bg-primary/10 border-primary/20 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          Anomalies & Alerts
        </h2>
        <p className="text-muted-foreground">System-generated notifications requiring attention.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Unresolved" count={summary?.unacknowledged || 0} type="default" onClick={() => setFilter("all")} active={filter === "all"} />
        <SummaryCard title="Critical" count={summary?.critical || 0} type="critical" onClick={() => setFilter("critical")} active={filter === "critical"} />
        <SummaryCard title="Warnings" count={summary?.warning || 0} type="warning" onClick={() => setFilter("warning")} active={filter === "warning"} />
        <SummaryCard title="Info" count={summary?.info || 0} type="info" onClick={() => setFilter("info")} active={filter === "info"} />
      </div>

      <Card className="bg-card border-card-border">
        <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
          <CardTitle>Alert Feed</CardTitle>
          <Button variant="outline" size="sm" className="text-xs h-8">Acknowledge All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {loadingAlerts ? (
              <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>
            ) : alerts?.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 text-green-500/50 mb-4" />
                <p>No active alerts matching criteria.</p>
              </div>
            ) : alerts?.map(alert => (
              <div key={alert.id} className={cn("p-5 flex flex-col md:flex-row gap-4 transition-colors hover:bg-muted/20", alert.isAcknowledged ? "opacity-60" : "")}>
                <div className="shrink-0 pt-1">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Badge variant="outline" className={cn("text-[10px] uppercase", getSeverityClass(alert.severity))}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] uppercase bg-background">
                      {alert.category}
                    </Badge>
                    {alert.agentName && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Bot className="h-3 w-3" /> {alert.agentName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center md:items-start pt-1">
                  {!alert.isAcknowledged && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-muted">Ack</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, count, type, onClick, active }: { title: string; count: number; type: string; onClick: () => void; active: boolean }) {
  let colors = "";
  if (type === "critical") colors = active ? "border-destructive ring-1 ring-destructive/50 bg-destructive/10" : "border-card-border hover:border-destructive/50";
  else if (type === "warning") colors = active ? "border-yellow-500 ring-1 ring-yellow-500/50 bg-yellow-500/10" : "border-card-border hover:border-yellow-500/50";
  else if (type === "info") colors = active ? "border-primary ring-1 ring-primary/50 bg-primary/10" : "border-card-border hover:border-primary/50";
  else colors = active ? "border-muted-foreground ring-1 ring-muted-foreground/50 bg-muted/20" : "border-card-border hover:border-muted-foreground/50";

  return (
    <Card className={cn("cursor-pointer transition-all", colors)} onClick={onClick}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className={cn("text-2xl font-bold", type === "critical" ? "text-destructive" : type === "warning" ? "text-yellow-500" : type === "info" ? "text-primary" : "text-foreground")}>
          {count}
        </div>
      </CardContent>
    </Card>
  );
}