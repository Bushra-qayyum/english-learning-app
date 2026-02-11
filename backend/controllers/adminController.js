// backend/controllers/adminController.js
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Assignment from "../models/Assignment.js";
import Activity from "../models/Activity.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalLessons = await Lesson.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({ totalUsers, totalStudents, totalTeachers, totalLessons, totalAssignments, activeUsers });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export const getRecentData = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(10);
    const lessons = await Lesson.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("teacher", "name email")
      .lean();

    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("teacher", "name")
      .lean();

    res.json({ users, lessons, assignments });
  } catch (err) {
    console.error("Recent Data Error:", err);
    res.status(500).json({ message: "Failed to fetch recent data" });
  }
};

// Baki functions same rahenge...
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

// ... baaki sab functions same

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    await Activity.create({ type: "user_role_change", message: `Role changed for ${user.email} to ${role}`, meta: { userId: user._id, role } });
    res.json({ message: "Role updated", user });
  } catch (err) {
    console.error("Update Role Error:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

// PUT /api/admin/users/:id/toggle
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    await Activity.create({ type: "user_toggle_active", message: `${user.email} is now ${user.isActive ? "Active" : "Inactive"}`, meta: { userId: user._id } });
    res.json({ message: "User status updated", user });
  } catch (err) {
    console.error("Toggle Active Error:", err);
    res.status(500).json({ message: "Failed to toggle user status" });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Activity.create({ type: "user_delete", message: `User ${user.email} deleted`, meta: { userId: user._id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// GET /api/admin/analytics
export const getAnalyticsData = async (req, res) => {
  try {
    // monthly user growth
    const userGrowth = await User.aggregate([
      { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.month": 1 } },
    ]);
    // role counts
    const roleCounts = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
    // lesson trend
    const lessonActivity = await Lesson.aggregate([
      { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.month": 1 } },
    ]);
    // adminController.js mein getRecentData function mein
const lessons = await Lesson.find()
  .sort({ createdAt: -1 })
  .limit(10)
  .populate("teacher", "name email")
  .lean(); // ← .lean() add kar diya taaki strictPopulate error na aaye
    // assignment trend
    const assignmentActivity = await Assignment.aggregate([
      { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.month": 1 } },
    ]);

    res.json({ userGrowth, roleCounts, lessonActivity, assignmentActivity });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
