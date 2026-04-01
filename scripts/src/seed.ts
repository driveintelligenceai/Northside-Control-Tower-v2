import { db, pool } from "@workspace/db";
import {
  serviceLines,
  leadSources,
  campaigns,
  patientLeads,
  contentAssets,
  agents,
  agentActivities,
  alerts,
  attributionTouchpoints,
  auditTrail,
} from "@workspace/db/schema";

async function seed() {
  console.log("Seeding Northside Hospital Control Tower data...");

  console.log("Clearing existing data...");
  await db.delete(attributionTouchpoints);
  await db.delete(auditTrail);
  await db.delete(agentActivities);
  await db.delete(alerts);
  await db.delete(agents);
  await db.delete(contentAssets);
  await db.delete(patientLeads);
  await db.delete(campaigns);
  await db.delete(leadSources);
  await db.delete(serviceLines);
  console.log("Existing data cleared.");

  const slData = [
    { name: "Cardiology", slug: "cardiology", description: "Heart and cardiovascular care including interventional cardiology, electrophysiology, and cardiac surgery" },
    { name: "Orthopedics", slug: "orthopedics", description: "Bone, joint, and musculoskeletal care including sports medicine and joint replacement" },
    { name: "Cancer Center", slug: "cancer-center", description: "Comprehensive oncology services including radiation therapy, chemotherapy, and surgical oncology" },
    { name: "Women's Health", slug: "womens-health", description: "OB/GYN services, fertility, breast health, and women's wellness" },
    { name: "Neuroscience", slug: "neuroscience", description: "Neurology and neurosurgery including stroke care, epilepsy, and spine surgery" },
    { name: "Digestive Health", slug: "digestive-health", description: "Gastroenterology, hepatology, and colorectal surgery" },
    { name: "Emergency Medicine", slug: "emergency-medicine", description: "24/7 emergency department and trauma services" },
    { name: "Primary Care", slug: "primary-care", description: "Family medicine, internal medicine, and preventive care" },
    { name: "Pediatrics", slug: "pediatrics", description: "Comprehensive children's health services from newborn to adolescent" },
    { name: "Surgical Services", slug: "surgical-services", description: "General surgery, minimally invasive surgery, and robotic surgery" },
  ];

  const insertedSL = await db.insert(serviceLines).values(slData).returning();
  console.log(`Inserted ${insertedSL.length} service lines`);

  const lsData = [
    { name: "Google Ads", category: "paid_search" },
    { name: "Facebook Ads", category: "social_media" },
    { name: "Instagram Ads", category: "social_media" },
    { name: "Physician Referrals", category: "referral" },
    { name: "Website Organic", category: "organic" },
    { name: "Community Events", category: "community" },
    { name: "Direct Mail", category: "direct_mail" },
    { name: "Insurance Partner Referrals", category: "referral" },
    { name: "YouTube Ads", category: "social_media" },
    { name: "Email Marketing", category: "email" },
    { name: "Billboard & OOH", category: "traditional" },
    { name: "Radio Advertising", category: "traditional" },
    { name: "Patient Referrals", category: "referral" },
    { name: "LinkedIn Ads", category: "social_media" },
    { name: "Bing Ads", category: "paid_search" },
  ];

  const insertedLS = await db.insert(leadSources).values(lsData).returning();
  console.log(`Inserted ${insertedLS.length} lead sources`);

  const campaignTypes = ["paid_search", "social_media", "content_marketing", "direct_mail", "community", "email"];
  const campaignStatuses = ["active", "active", "active", "paused", "completed"];
  const campaignNames = [
    "Heart Health Awareness Q1", "Joint Pain Relief Campaign", "Cancer Screening Drive",
    "Maternal Health Spring Push", "Brain Health Awareness", "Digestive Wellness Month",
    "ER Wait Time Campaign", "Annual Checkup Reminder", "Pediatric Flu Season",
    "Minimally Invasive Surgery Awareness", "Cardio Rehab Program Launch", "Sports Medicine Fall Push",
    "Breast Cancer Awareness Oct", "Prenatal Care Community Push", "Stroke Prevention Campaign",
    "Colon Cancer Screening Drive", "Urgent Care Expansion Ads", "Wellness Visit Q2 Push",
    "Back to School Physicals", "Robotic Surgery Innovation",
    "Heart Month February Blitz", "Orthopedic Recovery Stories", "Cancer Survivorship Series",
    "Women's Wellness Webinars", "Neuro Patient Testimonials",
  ];

  const campaignData = campaignNames.map((name, i) => {
    const slIdx = i % insertedSL.length;
    const monthsAgo = Math.floor(Math.random() * 12);
    const start = new Date();
    start.setMonth(start.getMonth() - monthsAgo);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 2 + Math.floor(Math.random() * 3));
    const budget = 5000 + Math.floor(Math.random() * 95000);
    const spentPct = 0.4 + Math.random() * 0.55;
    const spent = Math.round(budget * spentPct);
    const impressions = 10000 + Math.floor(Math.random() * 490000);
    const ctr = 0.01 + Math.random() * 0.06;
    const clicks = Math.floor(impressions * ctr);
    const convRate = 0.02 + Math.random() * 0.12;
    const conversions = Math.floor(clicks * convRate);

    return {
      name,
      type: campaignTypes[i % campaignTypes.length],
      status: campaignStatuses[i % campaignStatuses.length],
      serviceLineId: insertedSL[slIdx].id,
      startDate: start.toISOString().split("T")[0],
      endDate: end > new Date() ? null : end.toISOString().split("T")[0],
      budget: budget.toString(),
      spent: spent.toString(),
      impressions,
      clicks,
      conversions,
    };
  });

  const insertedCampaigns = await db.insert(campaigns).values(campaignData).returning();
  console.log(`Inserted ${insertedCampaigns.length} campaigns`);

  const leadStatuses = ["new", "contacted", "scheduled", "completed", "no_show", "cancelled", "follow_up"];
  const leadWeights = [15, 10, 25, 30, 5, 5, 10];

  function weightedRandom(weights: number[]): number {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) return i;
    }
    return weights.length - 1;
  }

  console.log("Generating patient leads (this may take a moment)...");
  const batchSize = 1000;
  const totalLeads = 50000;
  let leadsInserted = 0;

  for (let batch = 0; batch < Math.ceil(totalLeads / batchSize); batch++) {
    const batchData = [];
    const currentBatchSize = Math.min(batchSize, totalLeads - leadsInserted);

    for (let i = 0; i < currentBatchSize; i++) {
      const daysAgo = Math.floor(Math.random() * 450);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const statusIdx = weightedRandom(leadWeights);
      const status = leadStatuses[statusIdx];
      const isNewPatient = Math.random() > 0.35;
      const slIdx = Math.floor(Math.random() * insertedSL.length);
      const lsIdx = Math.floor(Math.random() * insertedLS.length);
      const campIdx = Math.floor(Math.random() * insertedCampaigns.length);

      let appointmentDate = null;
      let completedDate = null;
      let followUpDate = null;

      if (["scheduled", "completed", "no_show", "follow_up"].includes(status)) {
        appointmentDate = new Date(createdAt);
        appointmentDate.setDate(appointmentDate.getDate() + 3 + Math.floor(Math.random() * 14));
      }
      if (["completed", "follow_up"].includes(status)) {
        completedDate = appointmentDate ? new Date(appointmentDate) : null;
      }
      if (status === "follow_up") {
        followUpDate = completedDate ? new Date(completedDate) : null;
        if (followUpDate) followUpDate.setDate(followUpDate.getDate() + 7 + Math.floor(Math.random() * 21));
      }

      const patientNum = String(leadsInserted + i + 1).padStart(6, "0");
      batchData.push({
        patientId: `NH-${patientNum}`,
        serviceLineId: insertedSL[slIdx].id,
        leadSourceId: insertedLS[lsIdx].id,
        campaignId: insertedCampaigns[campIdx].id,
        status,
        isNewPatient,
        appointmentDate,
        completedDate,
        followUpDate,
        createdAt,
      });
    }

    await db.insert(patientLeads).values(batchData);
    leadsInserted += currentBatchSize;
    if (batch % 5 === 0) console.log(`  ...${leadsInserted} leads inserted`);
  }
  console.log(`Inserted ${leadsInserted} patient leads total`);

  const contentTypes = ["blog", "landing_page", "video", "social", "email"];
  const contentData = [
    { title: "5 Signs You Need a Heart Checkup", type: "blog", slIdx: 0, views: 12450, clicks: 890, conversions: 67 },
    { title: "Cardiology Services Landing Page", type: "landing_page", slIdx: 0, views: 28900, clicks: 3200, conversions: 245 },
    { title: "Joint Replacement Success Stories", type: "video", slIdx: 1, views: 8700, clicks: 620, conversions: 48 },
    { title: "Orthopedic Recovery Timeline Guide", type: "blog", slIdx: 1, views: 15200, clicks: 1100, conversions: 82 },
    { title: "Cancer Screening: What You Need to Know", type: "blog", slIdx: 2, views: 22100, clicks: 1800, conversions: 134 },
    { title: "Breast Cancer Awareness Video", type: "video", slIdx: 2, views: 45000, clicks: 5200, conversions: 312 },
    { title: "Prenatal Care Checklist", type: "blog", slIdx: 3, views: 9800, clicks: 720, conversions: 56 },
    { title: "Women's Health Screening Landing Page", type: "landing_page", slIdx: 3, views: 18500, clicks: 2100, conversions: 167 },
    { title: "Stroke Warning Signs Infographic", type: "social", slIdx: 4, views: 67000, clicks: 4500, conversions: 89 },
    { title: "Brain Health Tips Email Series", type: "email", slIdx: 4, views: 5600, clicks: 890, conversions: 45 },
    { title: "Digestive Health Diet Guide", type: "blog", slIdx: 5, views: 11200, clicks: 780, conversions: 61 },
    { title: "Colon Cancer Screening Facts", type: "landing_page", slIdx: 5, views: 14300, clicks: 1200, conversions: 98 },
    { title: "ER vs Urgent Care: Know When to Go", type: "blog", slIdx: 6, views: 31000, clicks: 2400, conversions: 178 },
    { title: "Annual Wellness Visit Benefits", type: "email", slIdx: 7, views: 7800, clicks: 560, conversions: 42 },
    { title: "Back to School Health Tips", type: "social", slIdx: 8, views: 23400, clicks: 1700, conversions: 95 },
    { title: "Minimally Invasive Surgery Explained", type: "video", slIdx: 9, views: 19600, clicks: 1400, conversions: 112 },
    { title: "Patient Testimonial: Heart Surgery Recovery", type: "video", slIdx: 0, views: 35200, clicks: 2800, conversions: 198 },
    { title: "Sports Medicine Injury Prevention", type: "blog", slIdx: 1, views: 16800, clicks: 1200, conversions: 89 },
    { title: "Cancer Treatment Options Overview", type: "landing_page", slIdx: 2, views: 21500, clicks: 2500, conversions: 201 },
    { title: "Pregnancy Journey Newsletter", type: "email", slIdx: 3, views: 4200, clicks: 380, conversions: 29 },
    { title: "Neuroscience Research Updates", type: "blog", slIdx: 4, views: 7600, clicks: 420, conversions: 31 },
    { title: "Healthy Gut Social Campaign", type: "social", slIdx: 5, views: 42000, clicks: 3100, conversions: 156 },
    { title: "Emergency Preparedness Guide", type: "blog", slIdx: 6, views: 8900, clicks: 560, conversions: 38 },
    { title: "Preventive Health Screening Calendar", type: "landing_page", slIdx: 7, views: 12100, clicks: 980, conversions: 76 },
    { title: "Kids Health Activity Book", type: "social", slIdx: 8, views: 18700, clicks: 1300, conversions: 67 },
  ];

  const contentInsertData = contentData.map((c) => {
    const monthsAgo = Math.floor(Math.random() * 12);
    const publishDate = new Date();
    publishDate.setMonth(publishDate.getMonth() - monthsAgo);
    return {
      title: c.title,
      type: c.type,
      serviceLineId: insertedSL[c.slIdx].id,
      publishDate,
      views: c.views,
      clicks: c.clicks,
      conversions: c.conversions,
      engagementRate: String(Math.round((c.clicks / c.views) * 10000) / 100),
      status: "published" as const,
    };
  });

  await db.insert(contentAssets).values(contentInsertData);
  console.log(`Inserted ${contentInsertData.length} content assets`);

  const agentData = [
    {
      name: "Data Quality Agent",
      type: "data_quality",
      status: "active",
      accuracy: "94.7",
      errorRate: "2.1",
      confidenceScore: "91.3",
      tasksCompleted: 12847,
      tasksTotal: 13500,
      learningRate: "0.0234",
      description: "Monitors data integrity across all hospital systems, identifies missing fields, validates data formats, and flags inconsistencies in patient and campaign records",
    },
    {
      name: "Attribution Agent",
      type: "attribution",
      status: "active",
      accuracy: "89.2",
      errorRate: "3.8",
      confidenceScore: "87.6",
      tasksCompleted: 8934,
      tasksTotal: 9500,
      learningRate: "0.0312",
      description: "Analyzes multi-touch attribution across all marketing channels, builds attribution models, and continuously refines channel weighting based on conversion outcomes",
    },
    {
      name: "Anomaly Detection Agent",
      type: "anomaly_detection",
      status: "active",
      accuracy: "92.1",
      errorRate: "2.9",
      confidenceScore: "89.8",
      tasksCompleted: 6721,
      tasksTotal: 7200,
      learningRate: "0.0189",
      description: "Detects unusual patterns in booking volumes, campaign spend, conversion rates, and operational metrics. Alerts stakeholders to potential issues before they become critical",
    },
    {
      name: "Optimization Agent",
      type: "optimization",
      status: "active",
      accuracy: "87.5",
      errorRate: "4.2",
      confidenceScore: "85.1",
      tasksCompleted: 5432,
      tasksTotal: 6000,
      learningRate: "0.0278",
      description: "Recommends budget allocation changes, campaign adjustments, and content strategy modifications based on performance data and predictive modeling",
    },
    {
      name: "Compliance Agent",
      type: "compliance",
      status: "active",
      accuracy: "98.3",
      errorRate: "0.4",
      confidenceScore: "97.1",
      tasksCompleted: 15678,
      tasksTotal: 16000,
      learningRate: "0.0056",
      description: "Ensures all marketing materials and data handling comply with HIPAA regulations, monitors PHI exposure risks, and validates consent tracking across all patient touchpoints",
    },
  ];

  const insertedAgents = await db.insert(agents).values(agentData.map(a => ({
    ...a,
    lastRunAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
  }))).returning();
  console.log(`Inserted ${insertedAgents.length} agents`);

  const activityActions = [
    "Data validation scan completed",
    "Anomaly detected in booking pattern",
    "Attribution model recalibrated",
    "Campaign optimization recommendation generated",
    "HIPAA compliance check passed",
    "Data quality score updated",
    "Missing field report generated",
    "Channel weighting adjusted",
    "Budget reallocation suggested",
    "PHI exposure risk assessment completed",
    "Conversion pattern analysis completed",
    "Lead scoring model updated",
    "Content performance analysis completed",
    "A/B test results processed",
    "Seasonal trend adjustment applied",
  ];

  const activityData = [];
  for (const agent of insertedAgents) {
    for (let i = 0; i < 20; i++) {
      const hoursAgo = Math.floor(Math.random() * 168);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      activityData.push({
        agentId: agent.id,
        action: activityActions[Math.floor(Math.random() * activityActions.length)],
        details: `Processed ${100 + Math.floor(Math.random() * 900)} records with ${(90 + Math.random() * 9.5).toFixed(1)}% confidence`,
        status: Math.random() > 0.05 ? "success" : "warning",
        confidenceScore: String((85 + Math.random() * 14).toFixed(2)),
        timestamp,
      });
    }
  }

  await db.insert(agentActivities).values(activityData);
  console.log(`Inserted ${activityData.length} agent activities`);

  const alertData = [
    { title: "Booking Drop Detected", message: "Cardiology bookings dropped 23% week-over-week. This exceeds the 15% threshold. Review campaign performance and scheduling availability.", severity: "critical", category: "bookings", agentName: "Anomaly Detection Agent" },
    { title: "Campaign Overspend Alert", message: "Google Ads Heart Health campaign has exceeded 95% of budget with 2 weeks remaining. Current CPA is $142 vs target $120.", severity: "warning", category: "campaigns", agentName: "Optimization Agent" },
    { title: "Data Quality Issue", message: "12 patient records missing lead source attribution in the last 24 hours. This may affect attribution model accuracy.", severity: "warning", category: "data_quality", agentName: "Data Quality Agent" },
    { title: "HIPAA Compliance Flag", message: "Marketing email template #47 contains patient name in subject line. This may violate HIPAA minimum necessary standard.", severity: "critical", category: "compliance", agentName: "Compliance Agent" },
    { title: "Attribution Model Update", message: "Multi-touch attribution model has been recalibrated. Physician referrals now account for 28% of conversions (up from 22%).", severity: "info", category: "attribution", agentName: "Attribution Agent" },
    { title: "Conversion Spike Detected", message: "Orthopedics landing page conversions up 45% following Sports Medicine Fall Push campaign launch.", severity: "info", category: "bookings", agentName: "Anomaly Detection Agent" },
    { title: "Campaign Performance Warning", message: "Direct mail campaign for Cancer Screening has a CPA of $280, significantly above the $150 target.", severity: "warning", category: "campaigns", agentName: "Optimization Agent" },
    { title: "Missing Consent Records", message: "34 new patient records created without explicit marketing consent documentation. Review intake process.", severity: "critical", category: "compliance", agentName: "Compliance Agent" },
    { title: "Lead Source Data Gap", message: "Website organic tracking code missing on 3 landing pages. Leads from these pages are unattributed.", severity: "warning", category: "data_quality", agentName: "Data Quality Agent" },
    { title: "Seasonal Pattern Detected", message: "Historical data suggests 15-20% increase in Women's Health inquiries expected in next 4 weeks. Recommend increasing campaign budget.", severity: "info", category: "optimization", agentName: "Optimization Agent" },
    { title: "High No-Show Rate", message: "Emergency Medicine no-show rate has increased to 18% this month, up from the 12% baseline.", severity: "warning", category: "bookings", agentName: "Anomaly Detection Agent" },
    { title: "Content Performance Alert", message: "Video content engagement rate dropped below 2% threshold. 3 videos published this month underperforming.", severity: "warning", category: "content", agentName: "Optimization Agent" },
    { title: "Agent Learning Milestone", message: "Attribution Agent accuracy improved from 85.1% to 89.2% over the past 30 days through recursive learning.", severity: "info", category: "system", agentName: "Attribution Agent" },
    { title: "Budget Optimization Complete", message: "Q1 budget reallocation analysis complete. Recommended shifting $12K from Radio to Google Ads based on CPA analysis.", severity: "info", category: "optimization", agentName: "Optimization Agent" },
    { title: "Duplicate Record Detection", message: "47 potential duplicate patient records identified across Cardiology and Primary Care service lines.", severity: "warning", category: "data_quality", agentName: "Data Quality Agent" },
  ];

  const alertInsertData = alertData.map((a, i) => {
    const hoursAgo = Math.floor(Math.random() * 72);
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    return {
      ...a,
      isAcknowledged: i > 5 ? Math.random() > 0.5 : false,
      createdAt,
    };
  });

  await db.insert(alerts).values(alertInsertData);
  console.log(`Inserted ${alertInsertData.length} alerts`);

  console.log("Generating attribution touchpoints...");
  const touchpointChannels = ["organic_search", "paid_search", "social_media", "email", "direct", "referral", "display_ads", "video"];
  const touchpointTypes = ["click", "impression", "form_submit", "phone_call", "chat"];

  const leadIdRows = await db.select({ id: patientLeads.id }).from(patientLeads).limit(5000);
  const leadIds = leadIdRows.map(r => r.id);

  const touchpointBatchSize = 2000;
  let touchpointsInserted = 0;
  const totalTouchpoints = 25000;

  for (let batch = 0; batch < Math.ceil(totalTouchpoints / touchpointBatchSize); batch++) {
    const batchData = [];
    const currentSize = Math.min(touchpointBatchSize, totalTouchpoints - touchpointsInserted);
    for (let i = 0; i < currentSize; i++) {
      const leadId = leadIds[Math.floor(Math.random() * leadIds.length)];
      const daysAgo = Math.floor(Math.random() * 450);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      batchData.push({
        patientLeadId: leadId,
        leadSourceId: insertedLS[Math.floor(Math.random() * insertedLS.length)].id,
        campaignId: Math.random() > 0.3 ? insertedCampaigns[Math.floor(Math.random() * insertedCampaigns.length)].id : null,
        touchpointType: touchpointTypes[Math.floor(Math.random() * touchpointTypes.length)],
        channel: touchpointChannels[Math.floor(Math.random() * touchpointChannels.length)],
        position: (i % 4) + 1,
        interactionDate: date,
      });
    }
    await db.insert(attributionTouchpoints).values(batchData);
    touchpointsInserted += currentSize;
  }
  console.log(`Inserted ${touchpointsInserted} attribution touchpoints`);

  console.log("Generating audit trail entries...");
  const auditActions = [
    { action: "CREATE", entityType: "campaign", details: { name: "New campaign created via control tower" } },
    { action: "UPDATE", entityType: "campaign", details: { field: "budget", oldValue: 15000, newValue: 22000 } },
    { action: "VIEW", entityType: "dashboard", details: { page: "command-center" } },
    { action: "EXPORT", entityType: "report", details: { format: "csv", reportType: "attribution" } },
    { action: "UPDATE", entityType: "agent_config", details: { agentName: "Anomaly Detection", field: "threshold" } },
    { action: "VIEW", entityType: "patient_lead", details: { note: "De-identified access only" } },
    { action: "ACK", entityType: "alert", details: { severity: "critical" } },
    { action: "CREATE", entityType: "content_asset", details: { type: "blog", title: "New health guide" } },
  ];

  const auditEntries = [];
  for (let i = 0; i < 200; i++) {
    const template = auditActions[i % auditActions.length];
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    auditEntries.push({
      action: template.action,
      entityType: template.entityType,
      entityId: String(Math.floor(Math.random() * 100) + 1),
      userId: `admin-${(i % 5) + 1}`,
      details: template.details,
      createdAt: date,
    });
  }
  await db.insert(auditTrail).values(auditEntries);
  console.log(`Inserted ${auditEntries.length} audit trail entries`);

  console.log("\nSeed complete!");
}

seed()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    pool.end();
    process.exit(1);
  });
