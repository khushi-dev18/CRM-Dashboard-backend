import { Router } from "express";
import Contact from "../models/Contact.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      tags: req.body.tags || [],
    });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
