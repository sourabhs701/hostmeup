import express from "express";
import { protectedRoute, generateToken } from "./middleware.js";
import { db } from "./db/db.js";
import { users, files } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { s3Helper } from "./s3.js";
import dotenv from "dotenv";
import path from "path";
import si from "systeminformation";
import fs from "fs";
import cors from "cors";
import axios from "axios";

const __dirname = path.resolve();

dotenv.config();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  fs.appendFile(
    path.join(__dirname, "logs", "requests.txt"),
    `${new Date().toISOString()} - ${req.method} ${req.url}\n`,
    (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    }
  );
  next();
});

app.get("/auth/github", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const { data: tokenData } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (tokenData.error || !tokenData.access_token) {
      return res.status(400).json({ error: "Failed to retrieve access token" });
    }

    const accessToken = tokenData.access_token;

    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const user = {
      id: String(data.id),
      avatar: data.avatar_url,
      username: data.login,
      email: data.email,
      name: data.name,
      twitter_username: data.twitter_username,
      created_at: new Date().toISOString(),
    };

    const token = generateToken(user);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (existingUser.length === 0) {
      await db.insert(users).values(user);
    }

    const redirectUrl = `http://localhost:5173/auth?token=${token}`;

    res.redirect(redirectUrl);
  } catch (err) {
    console.error("GitHub OAuth Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/metrics", async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const temp = await si.cpuTemperature();
    const metrics = { cpu, mem, temp };
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

app.get("/files", protectedRoute, async (req, res) => {
  try {
    const userFiles = await db
      .select()
      .from(files)
      .where(eq(files.userId, req.user.id))
      .orderBy(files.uploadedAt);

    // Calculate storage usage
    const totalSize = userFiles.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const totalSizeGB = 1; // 1GB limit
    const usedSizeMB = (totalSize / (1024 * 1024)).toFixed(1);
    const usagePercentage =
      (totalSize / (totalSizeGB * 1024 * 1024 * 1024)) * 100;

    res.json({
      files: userFiles,
      storage: {
        totalSize,
        usedSizeMB: parseFloat(usedSizeMB),
        totalSizeGB,
        usagePercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

app.delete("/files/:id", protectedRoute, async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);

    const result = await db.select().from(files).where(eq(files.id, fileId));
    const file = result[0];

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    console.log(file.userId);
    console.log(req.user.id);

    if (file.userId != req.user.id) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this file" });
    }

    await db.delete(files).where(eq(files.id, fileId));

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.get("/upload", protectedRoute, async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const key = s3Helper.generateFileKey(req.user.id, filename);
    const { uploadUrl, expiresIn } = await s3Helper.generateUploadUrl(
      key,
      contentType
    );

    res.json({
      uploadUrl,
      key,
      expiresIn,
      message: "Upload URL generated successfully",
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

app.post("/files/confirm", protectedRoute, async (req, res) => {
  try {
    const { filename, size, key } = req.body;

    if (!filename || !size || !key) {
      return res
        .status(400)
        .json({ error: "Filename, size, and key are required" });
    }

    const result = await db
      .insert(files)
      .values({
        name: filename,
        size,
        key,
        userId: req.user.id,
      })
      .returning();
    const file = result[0];

    res.status(201).json({
      message: "File metadata saved successfully",
      file,
    });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ error: "Failed to save file metadata" });
  }
});

app.use(express.static(path.join(__dirname, "./public")));

app.get("*rest", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
