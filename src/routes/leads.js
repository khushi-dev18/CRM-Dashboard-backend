import { Router } from "express";
import Lead from "../models/Lead.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const leads = await Lead.find({}).sort({ order: 1 });
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const newLead = await Lead.create({
      ...req.body,
      order: 0,
      tags: req.body.tags || [],
    });
    res.json({ success: true, lead: newLead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date().toISOString() },
      { new: true }
    );
    if (!updatedLead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead: updatedLead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/reorder", requireAuth, async (req, res) => {
  try {
    const { updates } = req.body;
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: "Invalid updates format" });
    }

    // Execute updates in parallel
    await Promise.all(
      updates.map((u) =>
        Lead.findByIdAndUpdate(u.id, { status: u.status, order: u.order })
      )
    );
    res.json({ success: true, message: "Pipeline updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
