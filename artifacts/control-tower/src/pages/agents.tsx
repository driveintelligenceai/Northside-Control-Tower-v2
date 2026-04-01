import { useListAgents, useGetAgentHealth, useGetAgentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Cpu, CheckCircle2, AlertCircle, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const { data: agents, isLoading: loadingAgents } = useListAgents();
  const { data: health, isLoading: loadingHealth } = useGetAgentHealth();
  const safeAgents = Array.isArray(agents) ? agents : [];
  const healthData =
    health && typeof health === "object"
      ? health
      : {
          activeAgents: 0,
          totalAgents: 0,
          avgAccuracy: 0,
          avgErrorRate: 0,
          totalTasksToday: 0,
        };
  
  const activeAgentId = safeAgents.find(a => a.status === 'active')?.id || 1;
  const { data: activity, isLoading: loadingActivity } = useGetAgentActivity(activeAgentId, { limit: 10 });
  const safeActivity = Array.isArray(activity) ? activity : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">AI Agents Monitor</h2>
        <p className="text-muted-foreground text-sm mt-1">Status and learning metrics for autonomous marketing agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-card-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Fleet Status</div>
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{healthData.activeAgents} / {healthData.totalAgents}</div>
            <div className="mt-1 text-xs text-green-600 font-medium">Agents Online</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-card-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Avg Accuracy</div>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{healthData.avgAccuracy.toFixed(1)}%</div>
            <div className="mt-1 text-xs text-muted-foreground">Confidence Threshold</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-card-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Error Rate</div>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="mt-2 text-2xl font-bold text-destructive">{healthData.avgErrorRate.toFixed(2)}%</div>
            <div className="mt-1 text-xs text-muted-foreground">Requires intervention</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-card-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Tasks Today</div>
              <TerminalSquare className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{healthData.totalTasksToday.toLocaleString()}</div>
            <div className="mt-1 text-xs text-muted-foreground">Autonomous actions</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Agent Roster</h3>
          {loadingAgents ? (
            <div className="animate-pulse h-40 bg-muted rounded-md"></div>
          ) : safeAgents.map(agent => (
            <Card key={agent.id} className="bg-white border-card-border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-border">
                <div className="p-5 md:w-1/3 border-r border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", agent.status === 'active' ? 'bg-green-500' : 'bg-amber-400')} />
                    <h4 className="font-semibold text-base text-foreground">{agent.name}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs uppercase bg-white border-border">{agent.type.replace('_', ' ')}</Badge>
                  <p className="mt-3 text-xs text-muted-foreground">{agent.description}</p>
                </div>
                <div className="p-5 md:w-2/3 grid grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-mono font-semibold text-primary">{agent.accuracy}%</span>
                    </div>
                    <Progress value={agent.accuracy} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono font-semibold text-accent">{agent.confidenceScore}%</span>
                    </div>
                    <Progress value={agent.confidenceScore} className="h-1.5 bg-muted" indicatorClassName="bg-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tasks Completed</div>
                    <div className="font-mono text-lg text-foreground">{agent.tasksCompleted.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Run</div>
                    <div className="text-sm text-foreground">{new Date(agent.lastRunAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-white border-card-border shadow-sm flex flex-col h-[600px] font-mono">
          <CardHeader className="border-b border-border py-3 px-4 bg-slate-50">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-2 font-mono">
              <TerminalSquare className="h-4 w-4" />
              Agent Live Feed (sys_id: {activeAgentId})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto text-xs space-y-2 bg-slate-50/50">
            {loadingActivity ? (
              <div className="text-muted-foreground">Establishing connection...</div>
            ) : safeActivity.map(log => (
              <div key={log.id} className="flex gap-3 items-start border-l-2 border-border pl-3 py-1">
                <span className="text-muted-foreground shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex-1">
                  <span className={cn(
                    "mr-2 font-bold",
                    log.status === 'success' ? "text-green-600" : 
                    log.status === 'failed' ? "text-destructive" : "text-amber-600"
                  )}>
                    [{log.status.toUpperCase()}]
                  </span>
                  <span className="text-foreground">{log.action}</span>
                  {log.details && <div className="text-muted-foreground mt-1 line-clamp-2">{log.details}</div>}
                  {log.confidenceScore && (
                    <div className="mt-1 text-accent">conf_score: {log.confidenceScore.toFixed(4)}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-accent animate-pulse">_</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
