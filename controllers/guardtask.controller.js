import Task from "../models/Guardtask.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can assign tasks" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Tasks fetched", tasks });
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUnachievedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "achieved" } })
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No unachieved tasks found" });
    }

    return res.status(200).json({
      message: "Unachieved tasks fetched successfully",
      tasks
    });
  } catch (error) {
    console.error("Get Unachieved Tasks Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["in_progress", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: `Task marked as ${status}`, task });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markTaskAchieved = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can mark as achieved" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status !== "completed") {
      return res.status(400).json({ message: "Task must be completed before marking as achieved" });
    }

    task.status = "achieved";
    await task.save();

    res.status(200).json({ message: "Task marked as achieved", task });
  } catch (err) {
    console.error("Achieve Task Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
