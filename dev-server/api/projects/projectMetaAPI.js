const express = require("express");
const router = express.Router();
const { FetchProject } = require("../../src/components/projectHelper");

// get project metadata
router.get("/projects/:id", async (req, res) => {
    const projectId = req.params.id;
    try {
        const projectsql = await FetchProject(projectId);
        const meta = projectsql.projectMETA;
        res.json(meta);
    } catch (error) {
        console.error("Error fetching project meta:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get project metadata
router.get("/users/:username/projects/:id", async (req, res) => {
    const projectId = req.params.id;
    try {
        const projectsql = await FetchProject(projectId);
        const meta = projectsql.projectMETA;
        res.json(meta);
    } catch (error) {
        console.error("Error fetching project meta:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;