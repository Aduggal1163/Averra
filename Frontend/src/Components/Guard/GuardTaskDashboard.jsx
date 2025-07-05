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
  Stack,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { BACKEND_URL } from "../../../config.js";
const statusDetails = {
  assigned: {
    color: "default",
    label: "Assigned",
    icon: <AssignmentIcon fontSize="small" sx={{ mr: 0.5 }} />,
    chipColor: "info",
  },
  in_progress: {
    color: "warning",
    label: "In Progress",
    icon: <HourglassTopIcon fontSize="small" sx={{ mr: 0.5 }} />,
    chipColor: "warning",
  },
  completed: {
    color: "success",
    label: "Completed",
    icon: <TaskAltIcon fontSize="small" sx={{ mr: 0.5 }} />,
    chipColor: "success",
  },
};

const tabDetails = [
  { label: "Assigned", icon: <AssignmentIcon /> },
  { label: "In Progress", icon: <HourglassTopIcon /> },
  { label: "Completed", icon: <TaskAltIcon /> },
];

const GuardTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [currentTab, setCurrentTab] = useState(0); // 0: Assigned, 1: In Progress, 2: Completed

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/guardtask/mytasks`, {
        headers: { Authorization: token },
      });
      setTasks(response.data.tasks);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load tasks", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.post(
        `${BACKEND_URL}/guardtask/update/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      setSnackbar({ open: true, message: `Task marked as ${statusDetails[newStatus].label}`, severity: "success" });
      fetchTasks();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update task", severity: "error" });
    }
  };

  const renderTaskCard = (task) => (
    <Card
      key={task._id}
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": {
          transform: "translateY(-4px) scale(1.03)",
          boxShadow: 6,
        },
        background: "linear-gradient(90deg, #e3f2fd 0%, #f8bbd0 100%)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center" }}>
          {statusDetails[task.status].icon}
          {task.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 2 }}>{task.description}</Typography>
        <Box>
          <Chip
            label={statusDetails[task.status].label}
            icon={statusDetails[task.status].icon}
            color={statusDetails[task.status].chipColor}
            sx={{ fontWeight: 500, fontSize: 13 }}
          />
        </Box>
      </CardContent>
      <CardActions>
        {task.status === "assigned" && (
          <Button
            onClick={() => updateTaskStatus(task._id, "in_progress")}
            variant="outlined"
            color="warning"
            startIcon={<HourglassTopIcon />}
          >
            Mark In Progress
          </Button>
        )}
        {task.status === "in_progress" && (
          <Button
            onClick={() => updateTaskStatus(task._id, "completed")}
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
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
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
        borderRadius: 2,
      }}
    >
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{
          mb: 3,
          "& .MuiTab-root": { fontWeight: 600, fontSize: 16, minHeight: 48 },
          "& .Mui-selected": { color: "#1976d2" },
        }}
        TabIndicatorProps={{
          style: {
            background: "linear-gradient(90deg, #1976d2 0%, #d81b60 100%)",
            height: 4,
            borderRadius: 2,
          },
        }}
      >
        {tabDetails.map((tab, idx) => (
          <Tab
            key={tab.label}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            sx={{ minWidth: 130 }}
          />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      ) : groupedTasks[currentTab].length === 0 ? (
        <Stack alignItems="center" sx={{ mt: 8 }}>
          {currentTab === 0 && <AssignmentIcon sx={{ fontSize: 48, color: "#bdbdbd" }} />}
          {currentTab === 1 && <HourglassTopIcon sx={{ fontSize: 48, color: "#ffa726" }} />}
          {currentTab === 2 && <TaskAltIcon sx={{ fontSize: 48, color: "#43a047" }} />}
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No tasks in this category.
          </Typography>
        </Stack>
      ) : (
        groupedTasks[currentTab].map(renderTaskCard)
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GuardTasks;
