import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCampaigns,
  useGetTopCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  getListCampaignsQueryKey,
  getGetTopCampaignsQueryKey,
} from "@workspace/api-client-react";
import type { CreateCampaignInput } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Megaphone, Search, Play, Pause, Trash2, TrendingUp, Plus, X } from "lucide-react";

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState<CreateCampaignInput>({
    name: "",
    type: "paid_search",
    startDate: new Date().toISOString().split("T")[0],
    budget: 0,
  });

  const { data: campaigns, isLoading } = useListCampaigns({ status: statusFilter });
  const { data: topCampaigns, isLoading: loadingTop } = useGetTopCampaigns({ period: "30d", limit: 3 });

  const invalidateCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetTopCampaignsQueryKey() });
  };

  const createMutation = useCreateCampaign({
    mutation: { onSuccess: () => { invalidateCampaigns(); setShowCreateForm(false); resetForm(); } },
  });

  const updateMutation = useUpdateCampaign({
    mutation: { onSuccess: () => invalidateCampaigns() },
  });

  const deleteMutation = useDeleteCampaign({
    mutation: { onSuccess: () => invalidateCampaigns() },
  });

  const resetForm = () => {
    setNewCampaign({ name: "", type: "paid_search", startDate: new Date().toISOString().split("T")[0], budget: 0 });
  };

  const handleCreate = () => {
    if (!newCampaign.name || !newCampaign.type || !newCampaign.startDate || newCampaign.budget <= 0) return;
    createMutation.mutate({ data: newCampaign });
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete campaign "${name}"? This action cannot be undone.`)) return;
    deleteMutation.mutate({ id });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US', { notation: "compact" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            Campaign Control Panel
          </h2>
          <p className="text-muted-foreground">Manage and monitor active marketing initiatives.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => { setShowCreateForm(!showCreateForm); if (showCreateForm) resetForm(); }}
            className={showCreateForm ? "bg-destructive text-destructive-foreground" : ""}
          >
            {showCreateForm ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <><Plus className="h-4 w-4 mr-1" /> New Campaign</>}
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card className="bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Campaign Name</label>
                <Input
                  placeholder="e.g. Spring Cardiology Push"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                <Select value={newCampaign.type} onValueChange={(val: string) => setNewCampaign(prev => ({ ...prev, type: val }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid_search">Paid Search</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="content_marketing">Content Marketing</SelectItem>
                    <SelectItem value="direct_mail">Direct Mail</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Budget ($)</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="10000"
                  value={newCampaign.budget || ""}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !newCampaign.name || newCampaign.budget <= 0}
              >
                {createMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          High-Velocity Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loadingTop ? (
            Array(3).fill(0).map((_, i) => <Card key={i} className="bg-card border-card-border h-32 animate-pulse" />)
          ) : topCampaigns?.map(camp => (
            <Card key={camp.campaignId} className="bg-gradient-to-br from-card to-card/50 border-card-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Megaphone className="h-16 w-16 text-primary" />
              </div>
              <CardContent className="p-5 relative z-10">
                <div className="text-sm font-medium text-muted-foreground truncate pr-8">{camp.campaignName}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{camp.conversions}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Conv</span>
                </div>
                <div className="mt-4 flex justify-between text-xs">
                  <span className="text-primary font-mono">ROI: {camp.roi}%</span>
                  <span className="text-muted-foreground">CPA: {formatCurrency(camp.cpa)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-card border-card-border mt-8">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Active Directory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search campaigns..." className="pl-9 w-[250px] bg-background/50 border-border" />
              </div>
              <Select value={statusFilter} onValueChange={(val: string) => setStatusFilter(val as "all" | "active" | "paused" | "completed")}>
                <SelectTrigger className="w-[140px] bg-background/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Service Line</th>
                  <th className="px-6 py-4 font-medium text-right">Spend / Budget</th>
                  <th className="px-6 py-4 font-medium text-right">Clicks</th>
                  <th className="px-6 py-4 font-medium text-right">Conv.</th>
                  <th className="px-6 py-4 font-medium text-right">CPA</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">Loading directory...</td></tr>
                ) : campaigns?.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{campaign.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{campaign.type.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'outline'}
                             className={campaign.status === 'active' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{campaign.serviceLineName || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono text-foreground">{formatCurrency(campaign.spent)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">of {formatCurrency(campaign.budget)}</div>
                      <div className="w-full bg-muted rounded-full h-1 mt-1.5">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">{formatNumber(campaign.clicks)}</td>
                    <td className="px-6 py-4 text-right font-mono text-foreground font-medium">{campaign.conversions}</td>
                    <td className="px-6 py-4 text-right font-mono text-accent">{campaign.cpa ? formatCurrency(campaign.cpa) : '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-primary"
                          onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                          disabled={updateMutation.isPending}
                          title={campaign.status === 'active' ? 'Pause campaign' : 'Activate campaign'}
                        >
                          {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => handleDelete(campaign.id, campaign.name)}
                          disabled={deleteMutation.isPending}
                          title="Delete campaign"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
