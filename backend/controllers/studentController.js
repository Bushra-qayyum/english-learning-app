import Assignment from "../models/Assignment.js";

// Get all assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, studentId } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.submissions.push({ student: studentId, answer });
    assignment.status = "Submitted";
    await assignment.save();

    res.json({ message: "Assignment submitted successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: "Error submitting assignment" });
  }
};
