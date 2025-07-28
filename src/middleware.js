import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "./db/db.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided or invalid format.",
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res
        .status(500)
        .json({ error: "Server error during authentication" });
    }
  }
};

export const generateToken = (id) => {
  return jwt.sign(
    {
      id: Number(id),
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const storage_limit = async (req, res, next) => {
  try {
    const { size } = req.query;

    const [user] = await db
      .select({
        storage_used: users.storage_used,
        storage_limit: users.storage_limit,
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const fileSize = +size || 0;

    if (user.storage_used + fileSize > user.storage_limit) {
      return res.status(400).json({ error: "Storage limit exceeded" });
    }

    next();
  } catch (err) {
    console.error("Storage limit check failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
