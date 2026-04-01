import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity, Users, Clock, Heart, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";
import { KpiTrustBadge } from "@/components/kpi-trust-badge";
import { useRoleView } from "@/context/role-context";
import {
  getNetNewSubtypes,
  getTumorSiteFunnel,
  getReferralLifecycle,
  getTimeToConsultTrend,
  getCardioOncPipeline,
} from "@/lib/oncology-data";

export default function OncologyPage() {
  const { role } = useRoleView();

  const subtypes = useMemo(getNetNewSubtypes, []);
  const tumorFunnel = useMemo(getTumorSiteFunnel, []);
  const referralLifecycle = useMemo(getReferralLifecycle, []);
  const timeToConsult = useMemo(getTimeToConsultTrend, []);
  const cardioOnc = useMemo(getCardioOncPipeline, []);

  const currentMedian = timeToConsult[timeToConsult.length - 1]?.median ?? 0;
  const currentP90 = timeToConsult[timeToConsult.length - 1]?.p90 ?? 0;

  const leakage = referralLifecycle.find(s => s.stage === "Leaked");
  const completed = referralLifecycle.find(s => s.stage === "Completed");

  const tumorBarData = tumorFunnel.map(t => ({
    name: t.name,
    Leads: t.leads,
    Consults: t.consults,
    "Tx Starts": t.treatmentStarts,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span>Oncology + Cardio-Oncology</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Operations Pipeline</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Oncology Control Center</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Funnel throughput, referral lifecycle, net-new patients, and cardio-oncology pathway.
        </p>
        <p className="text-xs text-accent mt-2 font-medium">{role.label} focus: {role.focus}</p>
      </div>

      {/* Net-New Patient Subtypes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Net-New Oncology Patients (MTD)</h3>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">4 subtypes per HIPAA de-id rules</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subtypes.map((s) => {
            const TrendIcon = s.trend > 0.03 ? TrendingUp : s.trend < -0.01 ? TrendingDown : Minus;
            const trendColor = s.trend > 0.03 ? "text-green-600" : s.trend < -0.01 ? "text-red-500" : "text-muted-foreground";
            const atTarget = s.value >= s.target;
            return (
              <Card key={s.key} className="bg-white border-card-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <KpiTrustBadge metricKey={`oncology.netnew.${s.key}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      {s.trend > 0 ? "+" : ""}{(s.trend * 100).toFixed(1)}%
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${atTarget ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                      vs {s.target} target
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tumor Site Funnel + Referral Lifecycle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tumor Site Funnel */}
        <Card className="bg-white border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Funnel by Tumor Site</CardTitle>
                <CardDescription className="text-xs">Leads → Consults → Treatment Starts</CardDescription>
              </div>
              <KpiTrustBadge metricKey="oncology.tumor_funnel" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tumorBarData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar dataKey="Leads" fill="#003B71" radius={[0, 3, 3, 0]} barSize={7} />
                  <Bar dataKey="Consults" fill="#0073CF" radius={[0, 3, 3, 0]} barSize={7} />
                  <Bar dataKey="Tx Starts" fill="#4BA3E3" radius={[0, 3, 3, 0]} barSize={7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Referral Lifecycle Funnel */}
        <Card className="bg-white border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Referral Lifecycle</CardTitle>
                <CardDescription className="text-xs">Created → Contacted → Scheduled → Completed (Leaked shown separately)</CardDescription>
              </div>
              <KpiTrustBadge metricKey="oncology.referral_lifecycle" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {referralLifecycle.filter(s => s.stage !== "Leaked").map((stage, i) => {
                const colors = ["#003B71", "#0073CF", "#4BA3E3", "#2E8B57"];
                const bg = colors[i] || "#9CA3AF";
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{stage.count.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{stage.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${stage.pct}%`, backgroundColor: bg }}
                      />
                    </div>
                  </div>
                );
              })}
              {leakage && (
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between rounded-md bg-red-50 px-3 py-2">
                  <div className="text-sm font-medium text-red-700">Leakage</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-700">{leakage.count}</span>
                    <Badge variant="destructive" className="text-[10px]">{leakage.pct}% of created</Badge>
                  </div>
                </div>
              )}
              {completed && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conversion rate (Created → Completed)</span>
                  <span className="font-semibold text-foreground">{completed.pct}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time to Consult Trend */}
      <Card className="bg-white border-card-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Time from Referral to First Oncology Consult (days)
              </CardTitle>
              <CardDescription>Median and P90 latency — week over week</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <KpiTrustBadge metricKey="oncology.time_to_consult" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Current Median</div>
                <div className="text-lg font-bold text-foreground">{currentMedian}d</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">P90</div>
                <div className="text-lg font-bold text-red-500">{currentP90}d</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeToConsult} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="median" name="Median (days)" stroke="#0073CF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p90" name="P90 (days)" stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cardio-Oncology Pipeline */}
      <Card className="bg-white border-card-border shadow-sm border-l-4 border-l-[#0E7490]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#0E7490]" />
                Cardio-Oncology Eligibility → Enrollment Pipeline
              </CardTitle>
              <CardDescription>Eligibility screening rate, enrollment conversion, and 30-day follow-up adherence</CardDescription>
            </div>
            <KpiTrustBadge metricKey="oncology.cardio_onc_pipeline" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cardioOnc.map((stage, i) => {
              const colors = ["bg-[#0E7490]/10 text-[#0E7490]", "bg-blue-50 text-blue-700", "bg-indigo-50 text-indigo-700", "bg-green-50 text-green-700"];
              const isGap = stage.rate < 60;
              return (
                <div key={stage.stage} className={`rounded-lg p-4 border ${isGap ? "border-amber-200 bg-amber-50" : "border-border bg-muted/20"}`}>
                  <div className="text-xs text-muted-foreground mb-1">{stage.stage}</div>
                  <div className="text-2xl font-bold text-foreground">{stage.count.toLocaleString()}</div>
                  <div className={`text-xs mt-1 font-medium ${isGap ? "text-amber-700" : "text-muted-foreground"}`}>
                    {stage.rate}% {i === 0 ? "of pipeline" : "conversion"}
                    {isGap && " ⚠ gap"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Pipeline Flow</div>
            <div className="flex items-center gap-1">
              {cardioOnc.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-1 flex-1 min-w-0">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                      <span>{stage.stage}</span>
                      <span>{stage.rate}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0E7490] opacity-80 transition-all duration-500"
                        style={{ width: `${stage.rate}%` }}
                      />
                    </div>
                  </div>
                  {i < cardioOnc.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-[#0E7490]" />
              <span>
                Screening-to-enrollment gap: <strong className="text-foreground">{
                  (cardioOnc[1]?.count ?? 0) - (cardioOnc[2]?.count ?? 0)
                } patients</strong> screened but not enrolled. Priority follow-up recommended.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific KPI priorities */}
      {(role.key === "cmo" || role.key === "oncology_manager" || role.key === "cardio_oncology_manager") && (
        <Card className="bg-white border-card-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {role.label} — Priority KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {role.primaryKpis.map((kpi) => (
                <div key={kpi} className="rounded-md border border-border bg-muted/20 px-3 py-2 flex items-center gap-2">
                  <Users className="h-3 w-3 text-accent shrink-0" />
                  <span className="text-xs text-foreground">{kpi}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
