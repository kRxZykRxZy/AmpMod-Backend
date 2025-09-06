const express = require("express");
const router = express.Router();
const { verifyUser, generateApiToken } = require("../../src/components/userHelper");

router.post("/users/:username/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    try {
        const user = await verifyUser(username, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const apiToken = await generateApiToken(user.id);
        res.json({ apiToken });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
    