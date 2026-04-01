import { Badge } from "@/components/ui/badge";
import { getTrustScores } from "@/lib/trust";

export function KpiTrustBadge({ metricKey }: { metricKey: string }) {
  const trust = getTrustScores(metricKey);
  return (
    <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
      Trust {trust.freshness}/{trust.completeness}
    </Badge>
  );
}
