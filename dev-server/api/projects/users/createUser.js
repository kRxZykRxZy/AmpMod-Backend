const express = require("express");
const router = express.Router();
const { createUser } = require("../../src/components/userHelper");

// Route to create a new user
router.post("/users/:username/create", async (req, res) => {
    const { username } = req.params;
    const { email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const usermeta = ```{"id": '',"username":"${username}","ampteam":false,"history":{"joined":"${new Date().toISOString()}"},"profile":{"id":135468493,"images":{"90x90":"","55x55":"","50x50":"},"status":"","bio":""```;
    try {
        const user = await createUser(username, email, password, usermeta);
        if (!user) {
            return res.status(409).json({ error: "Username already exists" });
        }
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }