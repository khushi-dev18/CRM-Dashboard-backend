import { Router } from "express";
import Note from "../models/Note.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const notes = await Note.find({}).populate("lead", "name company");
    const sorted = [...notes].sort(
      (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
    );
    res.json({ success: true, count: sorted.length, notes: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { content, lead, contact, pinned } = req.body;
    const newNote = await Note.create({
      content,
      lead: lead || null,
      contact: contact || null,
      pinned: Boolean(pinned),
    });
    const note = await Note.findById(newNote._id).populate("lead", "name company");
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("lead", "name company");
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
