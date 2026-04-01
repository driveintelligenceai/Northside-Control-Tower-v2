export type RoleKey =
  | "cmo"
  | "vp_marketing"
  | "oncology_manager"
  | "cardio_oncology_manager"
  | "physician_liaison"
  | "call_center_manager"
  | "access_manager"
  | "cfo_partner";

export type RoleView = {
  key: RoleKey;
  label: string;
  focus: string;
  primaryKpis: string[];
};

export const ROLE_VIEWS: RoleView[] = [
  {
    key: "cmo",
    label: "CMO",
    focus: "Board-ready growth, margin, and access bottlenecks.",
    primaryKpis: ["Net-new patients", "Campaign ROI", "Referral leakage", "Time-to-consult", "LTV:CAC"],
  },
  {
    key: "vp_marketing",
    label: "VP Marketing",
    focus: "Channel efficiency and attribution confidence.",
    primaryKpis: ["PAC", "Lead-to-consult", "Attribution variance", "Cost per acquisition", "Campaign spend"],
  },
  {
    key: "oncology_manager",
    label: "Oncology Manager",
    focus: "Oncology funnel throughput and leakage prevention.",
    primaryKpis: ["Oncology net-new", "Funnel conversion", "Referral leakage", "Treatment starts", "Time-to-consult"],
  },
  {
    key: "cardio_oncology_manager",
    label: "Cardio-Oncology Manager",
    focus: "Eligibility to enrollment pathway health.",
    primaryKpis: ["Eligible patients", "Screening rate", "Enrollment conversion", "Follow-up adherence", "Pipeline drop-off"],
  },
  {
    key: "physician_liaison",
    label: "Physician Liaison",
    focus: "Referral relationship performance and territory action.",
    primaryKpis: ["Referrals by physician", "Referral conversion", "Leakage by source", "ZIP penetration", "Open opportunities"],
  },
  {
    key: "call_center_manager",
    label: "Call Center Manager",
    focus: "Call center throughput and scheduling conversion.",
    primaryKpis: ["Call volume", "Abandonment rate", "Hold time", "Booked from calls", "SLA compliance"],
  },
  {
    key: "access_manager",
    label: "Access/Scheduling Manager",
    focus: "Capacity alignment and next-available access.",
    primaryKpis: ["Next available appointment", "Schedule fill rate", "No-show rate", "Wait time", "Backlog"],
  },
  {
    key: "cfo_partner",
    label: "CFO Business Partner",
    focus: "Financial credibility and contribution margin.",
    primaryKpis: ["Contribution margin", "PAC", "LTV:CAC", "Episode ROI", "Confidence interval"],
  },
];

export const DEFAULT_ROLE: RoleKey = "cmo";
