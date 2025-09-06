const express = require("express")
const router = express.Router()
const { AddProject } = require("../../src/components/projectHelper")
const { VerifyByApiToken } = require("../../src/components/userHelper")
const fs = require("fs")
const path = require("path")
const AdmZip = require("adm-zip")
const tar = require("tar-stream")
const { compress } = require("@oneidentity/zstd")

const projectFile = fs.readFileSync(path.resolve(__dirname, "../../example/Project.apz"))

let projectBase64
;(async () => {
    const zip = new AdmZip(projectFile)
    const entries = zip.getEntries()
    const pack = tar.pack()
    entries.forEach(e => {
        const data = e.getData()
        pack.entry({ name: e.entryName, size: data.length }, data)
    })
    pack.finalize()
    const tarChunks = []
    for await (const chunk of pack) tarChunks.push(chunk)
    const tarBuffer = Buffer.concat(tarChunks)
    const tarZstBuffer = await compress(tarBuffer, 3)
    projectBase64 = tarZstBuffer.toString("base64")
})()

router.post("/users/:username/projects/create", async (req, res) => {
    const { username } = req.params
    const apiKey = req.headers['x-api-key']
    const user = await VerifyByApiToken(apiKey)
    const meta = ```{
  "id": '',
  "title": "Untitled Project",
  "description": "",
  "instructions": "",
  "visibility": "invisible",
  "public": false,
  "comments_allowed": true,
  "is_published": flase,
  "author": {
    "id": ${user.id},
    "username": "${user.username}",
    "ampteam": false,
    "history": {
      "joined": "NaN"
    },
    "profile": {
      "id": null,
      "images": {
        "90x90": "",
        "60x60": "",
        "55x55": "",
        "50x50": "",
        "32x32": ""
      }
    }
  },
  "image": "",
  "images": {
    "282x218": "",
    "216x163": "",
    "200x200": "",
    "144x108": "",
    "135x102": "",
    "100x80": ""
  },
  "history": {
    "created": "${new Date().toISOString()}",
    "modified": "",
    "shared": ""
  },
  "stats": {
    "views": 0,
    "loves": 0,
    "favorites": 0,
    "remixes": 0
  },
  "remix": {
    "parent": null,
    "root": null
  },
  "project_token": "${(Math.random() + 1).toString(36).substring(7)}",
}```
    if (!user || user.username !== username) return res.status(403).json({ error: "Forbidden" })
    const project = await AddProject(username, meta, projectBase64)
    if (!project) return res.status(500).json({ error: "Failed to create project" })
    res.status(201).json({ projectId: project.id })
})

module.exports = router
