import { useListAgents, useGetAgentHealth, useGetAgentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Cpu, CheckCircle2, XCircle, AlertCircle, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const { data: agents, isLoading: loadingAgents } = useListAgents();
  const { data: health, isLoading: loadingHealth } = useGetAgentHealth();
  
  // Just fetching activity for the first agent as a demo log, or we could fetch all.
  // We'll use the first active agent's ID if available.
  const activeAgentId = agents?.find(a => a.status === 'active')?.id || 1;
  const { data: activity, isLoading: loadingActivity } = useGetAgentActivity(activeAgentId, { limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          AI Agents Monitor
        </h2>
        <p className="text-muted-foreground">Status and learning metrics for autonomous marketing agents.</p>
      </div>

      {/* Global Health */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Fleet Status</div>
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold">{health?.activeAgents || 0} / {health?.totalAgents || 0}</div>
            <div className="mt-1 text-xs text-green-400">Agents Online</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Avg Accuracy</div>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold">{health?.avgAccuracy.toFixed(1) || 0}%</div>
            <div className="mt-1 text-xs text-muted-foreground">Confidence Threshold</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Error Rate</div>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="mt-2 text-3xl font-bold text-destructive">{health?.avgErrorRate.toFixed(2) || 0}%</div>
            <div className="mt-1 text-xs text-muted-foreground">Requires intervention</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="text-muted-foreground text-sm">Tasks Today</div>
              <TerminalSquare className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 text-3xl font-bold">{health?.totalTasksToday.toLocaleString() || 0}</div>
            <div className="mt-1 text-xs text-muted-foreground">Autonomous actions</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Roster */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium">Agent Roster</h3>
          {loadingAgents ? (
            <div className="animate-pulse h-40 bg-card rounded-xl"></div>
          ) : agents?.map(agent => (
            <Card key={agent.id} className="bg-card border-card-border overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-border/50">
                <div className="p-6 md:w-1/3 border-r border-border/50 bg-muted/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", agent.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500')} />
                    <h4 className="font-semibold text-lg">{agent.name}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs uppercase bg-background">{agent.type.replace('_', ' ')}</Badge>
                  <p className="mt-4 text-xs text-muted-foreground">{agent.description}</p>
                </div>
                <div className="p-6 md:w-2/3 grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-mono text-primary">{agent.accuracy}%</span>
                    </div>
                    <Progress value={agent.accuracy} className="h-1.5 bg-muted" indicatorClassName="bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono text-accent">{agent.confidenceScore}%</span>
                    </div>
                    <Progress value={agent.confidenceScore} className="h-1.5 bg-muted" indicatorClassName="bg-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tasks Completed</div>
                    <div className="font-mono text-lg">{agent.tasksCompleted.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Last Run</div>
                    <div className="text-sm">{new Date(agent.lastRunAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Terminal Log */}
        <Card className="bg-[#0A0A0A] border-[#1F2937] flex flex-col h-[600px] font-mono shadow-2xl">
          <CardHeader className="border-b border-[#1F2937] py-3 px-4 bg-[#111111]">
            <CardTitle className="text-xs text-[#8B949E] flex items-center gap-2">
              <TerminalSquare className="h-4 w-4" />
              Agent Live Feed (sys_id: {activeAgentId})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto text-xs space-y-2">
            {loadingActivity ? (
              <div className="text-[#4B5563]">Establishing connection...</div>
            ) : activity?.map(log => (
              <div key={log.id} className="flex gap-3 items-start border-l border-[#1F2937] pl-3 py-1">
                <span className="text-[#4B5563] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <div className="flex-1">
                  <span className={cn(
                    "mr-2 font-bold",
                    log.status === 'success' ? "text-[#10B981]" : 
                    log.status === 'failed' ? "text-[#EF4444]" : "text-[#F59E0B]"
                  )}>
                    [{log.status.toUpperCase()}]
                  </span>
                  <span className="text-[#E5E7EB]">{log.action}</span>
                  {log.details && <div className="text-[#9CA3AF] mt-1 line-clamp-2">{log.details}</div>}
                  {log.confidenceScore && (
                    <div className="mt-1 text-[#60A5FA]">conf_score: {log.confidenceScore.toFixed(4)}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-[#10B981] animate-pulse">_</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}