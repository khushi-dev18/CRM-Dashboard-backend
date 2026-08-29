import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";
import Lead from "./models/Lead.js";
import Contact from "./models/Contact.js";
import Note from "./models/Note.js";
import Task from "./models/Task.js";

dotenv.config();

const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const daysAhead = (n) => new Date(Date.now() + n * 86400000);
const today = () => new Date();

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ttp_crm";
    await mongoose.connect(uri);
    console.log("🔌 Connected to MongoDB for seeding...");

    // Clear old data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Contact.deleteMany({});
    await Note.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️ Cleared existing database collections.");

    // Create default User
    const passwordHash = await bcrypt.hash("Test@1234", 10);
    const defaultUser = await User.create({
      name: "Alex Carter",
      email: "alex@timetoprogram.com",
      passwordHash,
      role: "owner",
      company: "Time To Program",
      avatar: "",
    });
    console.log("👤 Default User created (email: alex@timetoprogram.com, password: Test@1234)");

    // Define seed leads data template
    const rawLeads = [
      { name: "Dribbble Design", company: "Acme Corp", status: "New", priority: "High", source: "Website", value: 89345, ageDays: 8 },
      { name: "Google Pay", company: "Globex", status: "Qualified", priority: "High", source: "Referral", value: 124000, ageDays: 20 },
      { name: "Amazon Shopping", company: "Initech", status: "Proposal", priority: "Medium", source: "Cold Outreach", value: 32123, ageDays: 35 },
      { name: "Stripe", company: "Umbrella Co", status: "Won", priority: "High", source: "Event", value: 76500, ageDays: 60 },
      { name: "Notion", company: "Soylent", status: "New", priority: "Low", source: "Social", value: 12400, ageDays: 4 },
      { name: "Figma", company: "Hooli", status: "Qualified", priority: "Medium", source: "Website", value: 54000, ageDays: 14 },
      { name: "Linear", company: "Pied Piper", status: "Proposal", priority: "High", source: "Referral", value: 98000, ageDays: 28 },
      { name: "Slack", company: "Vehement", status: "Lost", priority: "Low", source: "Cold Outreach", value: 21000, ageDays: 95 },
      { name: "Vercel", company: "Massive Dynamic", status: "Won", priority: "High", source: "Referral", value: 143000, ageDays: 110 },
      { name: "Airtable", company: "Wayne Ent.", status: "Qualified", priority: "High", source: "Event", value: 67000, ageDays: 18 },
      { name: "Datadog", company: "Stark Industries", status: "New", priority: "Medium", source: "Website", value: 45000, ageDays: 2 },
      { name: "Snowflake", company: "Cyberdyne", status: "Proposal", priority: "High", source: "Referral", value: 152000, ageDays: 48 },
      { name: "HubSpot", company: "Tyrell Corp", status: "Won", priority: "Medium", source: "Event", value: 88000, ageDays: 150 },
      { name: "Asana", company: "Aperture Labs", status: "Qualified", priority: "Low", source: "Social", value: 30000, ageDays: 22 },
      { name: "Zoom", company: "Oscorp", status: "New", priority: "Medium", source: "Cold Outreach", value: 26000, ageDays: 6 },
      { name: "GitLab", company: "LexCorp", status: "Lost", priority: "Low", source: "Website", value: 18000, ageDays: 70 },
    ];

    // Create Leads
    const leads = [];
    for (const rl of rawLeads) {
      const email = `${rl.name.toLowerCase().replace(/[^a-z]/g, "")}@${rl.company.toLowerCase().replace(/[^a-z]/g, "")}.com`;
      const createdLead = await Lead.create({
        name: rl.name,
        email,
        phone: `+1 555 0${100 + leads.length + 1}`,
        company: rl.company,
        status: rl.status,
        priority: rl.priority,
        source: rl.source,
        value: rl.value,
        notes: rl.status === "Won" ? "Closed — annual contract signed." : "Active opportunity in the pipeline.",
        tags: ["saas"],
        order: 0,
        createdAt: daysAgo(rl.ageDays),
        updatedAt: daysAgo(Math.max(0, Math.floor(rl.ageDays / 4))),
      });
      leads.push(createdLead);
    }
    console.log(`📈 Created ${leads.length} Leads.`);

    // Create Contacts
    const rawContacts = [
      { name: "Olivia Bennett", title: "VP of Sales", company: "Acme Corp", tags: ["decision-maker", "warm"], favorite: true },
      { name: "Noah Carter", title: "CTO", company: "Globex", tags: ["technical", "champion"], favorite: true },
      { name: "Emma Walsh", title: "Procurement Manager", company: "Initech", tags: ["finance"], favorite: false },
      { name: "Liam Foster", title: "Founder", company: "Umbrella Co", tags: ["executive"], favorite: false },
      { name: "Ava Mitchell", title: "Head of Operations", company: "Hooli", tags: ["warm"], favorite: false },
      { name: "Ethan Brooks", title: "Product Lead", company: "Pied Piper", tags: ["champion", "technical"], favorite: true },
      { name: "Sophia Reed", title: "Marketing Director", company: "Wayne Ent.", tags: ["influencer"], favorite: false },
      { name: "Mason Hayes", title: "CFO", company: "Cyberdyne", tags: ["finance", "executive"], favorite: false },
      { name: "Isabella Diaz", title: "Head of Growth", company: "Stark Industries", tags: ["vip", "warm"], favorite: false },
      { name: "Lucas Park", title: "Engineering Manager", company: "Tyrell Corp", tags: ["technical"], favorite: false },
    ];

    const contacts = [];
    for (const rc of rawContacts) {
      const email = `${rc.name.split(" ")[0].toLowerCase()}@${rc.company.toLowerCase().replace(/[^a-z]/g, "")}.com`;
      const createdContact = await Contact.create({
        name: rc.name,
        title: rc.title,
        company: rc.company,
        email,
        phone: `+1 555 0${200 + contacts.length + 1}`,
        tags: rc.tags,
        favorite: rc.favorite,
        notes: rc.favorite ? "Primary point of contact." : "",
        createdAt: daysAgo((contacts.length + 1) * 7),
      });
      contacts.push(createdContact);
    }
    console.log(`👥 Created ${contacts.length} Contacts.`);

    // Match leads by company/name for Note & Task relations
    const findLeadId = (companyName) => {
      const found = leads.find((l) => l.company === companyName);
      return found ? found._id : null;
    };

    // Create Notes
    const notesData = [
      { content: "Decision expected end of month. Loop in a solutions engineer for the technical review.", company: "Globex", pinned: true, ageDays: 3 },
      { content: "Pricing pushback on the Pro tier — prepare an ROI one-pager before the next call.", company: "Initech", pinned: false, ageDays: 6 },
      { content: "Champion is leaving the company; identify a backup stakeholder ASAP.", company: "Pied Piper", pinned: true, ageDays: 9 },
      { content: "Security questionnaire + SOC 2 report requested. Sent to the trust center.", company: "Cyberdyne", pinned: false, ageDays: 12 },
      { content: "Great discovery call — strong interest in the analytics module.", company: "Acme Corp", pinned: false, ageDays: 1 },
      { content: "Expansion likely next quarter — multi-year deal already signed.", company: "Massive Dynamic", pinned: false, ageDays: 18 },
      { content: "Scheduling a technical deep-dive with the engineering team.", company: "Wayne Ent.", pinned: false, ageDays: 5 },
      { content: "Early stage, budget unconfirmed. Re-engage in two weeks.", company: "Soylent", pinned: false, ageDays: 2 },
    ];

    for (const nd of notesData) {
      const leadId = findLeadId(nd.company);
      await Note.create({
        content: nd.content,
        lead: leadId,
        contact: null,
        pinned: nd.pinned,
        createdAt: daysAgo(nd.ageDays),
      });
    }
    console.log("📝 Created Notes.");

    // Create Tasks
    const tasksData = [
      { title: "Send proposal follow-up to Initech", priority: "High", status: "Pending", dueDate: daysAgo(2), company: "Initech" },
      { title: "Schedule technical deep-dive with Wayne Ent.", priority: "Medium", status: "In Progress", dueDate: daysAhead(3), company: "Wayne Ent." },
      { title: "Quarterly check-in with Massive Dynamic", priority: "Low", status: "Pending", dueDate: daysAhead(7), company: "Massive Dynamic" },
      { title: "Draft ROI one-pager for Initech", priority: "High", status: "Completed", dueDate: daysAgo(4), company: "Initech" },
      { title: "Negotiate pricing with Cyberdyne", priority: "High", status: "Pending", dueDate: today(), company: "Cyberdyne" },
      { title: "Share case study with Globex", priority: "Medium", status: "Pending", dueDate: daysAhead(1), company: "Globex" },
      { title: "Confirm contract redlines with Pied Piper", priority: "High", status: "In Progress", dueDate: daysAgo(1), company: "Pied Piper" },
      { title: "Book discovery call with Oscorp", priority: "Low", status: "Pending", dueDate: daysAhead(5), company: "Oscorp" },
      { title: "Send security docs to Cyberdyne", priority: "Medium", status: "Completed", dueDate: daysAgo(8), company: "Cyberdyne" },
      { title: "Re-engage stalled deal at Soylent", priority: "Low", status: "Pending", dueDate: daysAhead(14), company: "Soylent" },
    ];

    for (const td of tasksData) {
      const leadId = findLeadId(td.company);
      await Task.create({
        title: td.title,
        priority: td.priority,
        status: td.status,
        dueDate: td.dueDate,
        relatedLead: leadId,
        relatedContact: null,
        completedAt: td.status === "Completed" ? daysAgo(1) : null,
        createdAt: daysAgo(3),
      });
    }
    console.log("✅ Created Tasks.");

    console.log("🌟 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
