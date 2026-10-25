
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let tasks = [];
let nextId = 1;

const priorities = ["High", "Medium", "Low"];

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a task
app.post("/api/tasks", (req, res) => {
    const { title, dueDate, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const taskPriority = priority || "Medium";

    if (!priorities.includes(taskPriority)) {
        return res.status(400).json({
            error: "Priority must be High, Medium, or Low"
        });
    }

    const task = {
        id: nextId++,
        title: title.trim(),
        completed: false,
        dueDate: dueDate || "",
        priority: taskPriority
    };

    tasks.push(task);
    res.status(201).json(task);
});

// Toggle task completion
app.patch("/api/tasks/:id", (req, res) => {
    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.completed = !task.completed;
    res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
