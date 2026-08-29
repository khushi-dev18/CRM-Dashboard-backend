import { Router } from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("relatedLead", "name company");
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, relatedLead, relatedContact } = req.body;
    const newTask = await Task.create({
      title,
      description,
      dueDate: dueDate || null,
      status: status || "Pending",
      priority: priority || "Medium",
      relatedLead: relatedLead || null,
      relatedContact: relatedContact || null,
      completedAt: status === "Completed" ? new Date().toISOString() : null,
    });
    const task = await Task.findById(newTask._id).populate("relatedLead", "name company");
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const current = await Task.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: "Task not found" });

    const next = { ...req.body };
    if (req.body.status === "Completed" && !current.completedAt) {
      next.completedAt = new Date().toISOString();
    }
    if (req.body.status && req.body.status !== "Completed") {
      next.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, next, { new: true }).populate("relatedLead", "name company");
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
