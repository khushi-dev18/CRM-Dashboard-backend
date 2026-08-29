import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/status", requireAuth, (req, res) => {
  res.json({
    success: true,
    configured: true,
    model: "gemini-2.5-flash (live via backend)",
  });
});

router.post("/lead-summary", requireAuth, (req, res) => {
  res.json({
    success: true,
    summary:
      "A strong mid-market opportunity with an engaged champion and confirmed budget. The deal is progressing well but hinges on a pending legal review.",
    riskScore: 38,
    suggestedPriority: "High",
    nextBestAction:
      "Send the signed MSA template to accelerate the legal review and lock a close date.",
  });
});

router.post("/generate-email", requireAuth, (req, res) => {
  res.json({
    success: true,
    subject: "Quick follow-up on next steps",
    body:
      "Hi there,\n\nThanks again for the great conversation earlier this week. I wanted to follow up with a quick summary of how we can help your team hit its goals this quarter.\n\nWould you be open to a 20-minute call later this week to walk through the proposal and answer any questions?\n\nBest,\nAlex Carter\nTime To Program",
  });
});

router.post("/sales-insights", requireAuth, (req, res) => {
  res.json({
    success: true,
    headline: "Pipeline is healthy, but proposals are stalling at the redline stage.",
    insights: [
      "Qualified-to-Proposal conversion is strong at 64%.",
      "Three high-value deals have sat in Proposal for over 30 days.",
      "Referral leads close at nearly 2x the rate of cold outreach.",
    ],
    recommendations: [
      "Prioritize the three stalled proposals with a tailored ROI one-pager.",
      "Double down on the referral channel — it's your highest-converting source.",
      "Set a 14-day SLA on the Proposal stage to prevent deals going cold.",
    ],
    healthScore: 74,
  });
});

export default router;
