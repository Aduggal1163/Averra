import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

const statusColors = {
  assigned: "default",
  in_progress: "warning",
  completed: "success",
};

const GuardTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [currentTab, setCurrentTab] = useState(0); // 0: Assigned, 1: In Progress, 2: Completed

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/guardtask/mytasks", {
        headers: { Authorization: token },
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error("Fetch Error:", err);
      setSnackbar({ open: true, message: "Failed to load tasks", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/guardtask/update/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      setSnackbar({ open: true, message: `Task marked as ${newStatus}`, severity: "success" });
      fetchTasks();
    } catch (err) {
      console.error("Update Error:", err);
      setSnackbar({ open: true, message: "Failed to update task", severity: "error" });
    }
  };

  const renderTaskCard = (task) => (
    <Card key={task._id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography>{task.description}</Typography>
        <Box mt={1}>
          <Chip
            label={task.status.replace("_", " ").toUpperCase()}
            color={statusColors[task.status]}
          />
        </Box>
      </CardContent>
      <CardActions>
        {task.status === "assigned" && (
          <Button
            onClick={() => updateTaskStatus(task._id, "in_progress")}
            variant="outlined"
            color="warning"
          >
            Mark In Progress
          </Button>
        )}
        {task.status === "in_progress" && (
          <Button
            onClick={() => updateTaskStatus(task._id, "completed")}
            variant="contained"
            color="success"
          >
            Mark Completed
          </Button>
        )}
      </CardActions>
    </Card>
  );

  const groupedTasks = {
    0: tasks.filter((t) => t.status === "assigned"),
    1: tasks.filter((t) => t.status === "in_progress"),
    2: tasks.filter((t) => t.status === "completed"),
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Assigned" />
        <Tab label="In Progress" />
        <Tab label="Completed" />
      </Tabs>

      {loading ? (
        <CircularProgress />
      ) : groupedTasks[currentTab].length === 0 ? (
        <Typography>No tasks in this category.</Typography>
      ) : (
        groupedTasks[currentTab].map(renderTaskCard)
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GuardTasks;
