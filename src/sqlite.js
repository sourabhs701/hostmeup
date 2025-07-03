import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./data/app.db");

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create files table
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size INTEGER NOT NULL,
      key TEXT NOT NULL,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    )
  `);

  console.log("Database tables created successfully");
};

createTables();

export const dbHelpers = {
  createUser: (username, password) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username, password],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username });
        }
      );
    });
  },

  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM user WHERE username = ?",
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  createFile: (name, size, key, userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO files (name, size, key, userId) VALUES (?, ?, ?, ?)",
        [name, size, key, userId],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, name, size, key, userId });
        }
      );
    });
  },

  getFilesByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM files WHERE userId = ? ORDER BY uploadedAt DESC",
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getFileById: (fileId) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM files WHERE id = ?", [fileId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  deleteFile: (fileId) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM files WHERE id = ?", [fileId], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  },
};
