const express = require("express");
const router = express.Router();
const { authenticateAdmin, authenticateUser, authenticateAdminAndViewer } = require("../middlewares/verify")
const db = require("../config/db");

// CRUD PROJECT
router.post("/create", authenticateAdmin, (req, res) => {
    const query = "INSERT INTO projects (`name`) VALUES (?)"
    db.query(query,
        [req.body.name, req.body.budget || "", req.body.deadline || ""],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({ error: "Internal Server Error" })
            }

            res.json({ message: "Project Created!" })
        }
    )
})

// Get all Projects
router.get("/getprojects", authenticateAdminAndViewer, async (req, res) => {
    const query = "SELECT * from projects"
    db.query(query,
        [],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({ error: "Internal Server Error" })
            }

            res.json({ results })
        }
    )
})

// Get active or non active Projects
router.get("/filterprojects", authenticateAdminAndViewer, async (req, res) => {
    const query = "SELECT * from projects where status = ?"
    db.query(query,
        [req.query.status],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({ error: "Internal Server Error" })
            }

            res.json({ results })
        }
    )
})

// Update Project
router.put("/update/:projectId", authenticateAdmin, (req, res) => {
    const projectId = req.params.projectId;
    const { name, budget, deadline } = req.body;

    if (name === undefined || budget === undefined || deadline === undefined) {
        return res.status(400).json({ error: "All fields (name, budget, deadline) are required" });
    }

    const query = "UPDATE projects SET name = ?, budget = ?, deadline = ? WHERE id = ?";
    db.query(query,
        [name, budget, deadline, projectId],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            res.json({ message: "Project updated successfully" });
        }
    );
});

// Ad Member to OSS projects
router.post("/addpmembers", authenticateAdmin, async (req, res) => {
    const query = "INSERT INTO projects_members (`project_id`, `user_id`) VALUES (?, ?)"
    db.query(query,
        [req.body.project_id, req.body.userId],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.json({ error: "Internal Server Error" })
            }

            res.json({ message: "Member Added!" })
        }
    )
})

// Delete Member
router.delete("/removeMember/:projectId/:userId", authenticateAdmin, (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.params.userId;

    const query = "DELETE FROM projects_members WHERE project_id = ? AND user_id = ?";
    db.query(query,
        [projectId, userId],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Member not found in the project" });
            }

            res.json({ message: "Member removed successfully" });
        }
    );
});


// Get project members
router.get("/getprojectmembers", authenticateAdminAndViewer, async (req, res) => {
    try {
        const projectId = req.query.project_id;
        const query = `
        SELECT pm.id, pm.project_id, p.name AS project_name, u.id AS user_id, u.email, u.username, u.role
        FROM projects_members pm
        INNER JOIN projects p ON pm.project_id = p.id
        INNER JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?`;

        db.query(query, [projectId], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Assign Task to Member
router.post("/createTask", authenticateAdmin, (req, res) => {
    const { projectId, description, assignedTo, deadline } = req.body;

    if (!projectId || !description || !assignedTo || !deadline) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query("SELECT * FROM projects WHERE id = ?", [projectId], (error, projectResults) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (projectResults.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        db.query("SELECT * FROM users WHERE id = ?", [assignedTo], (error, userResults) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ error: "Assigned user not found" });
            }

            // Insert the task into the tasks table
            db.query(
                "INSERT INTO tasks (project_id, description, assigned_to, deadline) VALUES (?, ?, ?, ?)",
                [projectId, description, assignedTo, deadline],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }

                    res.json({ message: "Task created successfully", taskId: results.insertId });
                }
            );
        });
    });
});

// Change Task Status (done by normal membr)
router.put("/changeTstatus/:taskId", authenticateUser, (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.id;

    db.query("SELECT * FROM tasks WHERE id = ? AND assigned_to = ?", [taskId, userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Task not found or not assigned to the user" });
        }

        db.query(
            "UPDATE tasks SET status = ? WHERE id = ?",
            [req.body.status, taskId],
            (error, updateResults) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                res.json({ message: req.body.status === 0 ? "Task marked as incomplete" : "Task marked as complete" });
            }
        );
    });
});

// Comment on tasks
router.put("/Tcomment/:taskId", authenticateUser, (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const userName = req.user.username;
    const newComment = {
        user: userId,
        userName: userName,
        comment: req.body.comment,
        timestamp: new Date().toISOString()
    };

    db.query("SELECT * FROM tasks WHERE id = ? AND assigned_to = ?", [taskId, userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Task not found or not assigned to the user" });
        }

        let comments = results[0].comments || [];
        if (typeof comments === 'string') {
            comments = JSON.parse(comments);
        }

        comments.push(newComment);

        db.query(
            "UPDATE tasks SET comments = ? WHERE id = ?",
            [JSON.stringify(comments), taskId],
            (error, updateResults) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                res.json({
                    comments: comments
                });
            }
        );
    });
});

module.exports = router
