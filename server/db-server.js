import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../src/data/db.json");
const port = 3001;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

async function readDb() {
  const raw = await readFile(dbPath, "utf8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function nextId(items) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Invalid request" });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  try {
    const db = await readDb();

    if (req.method === "GET" && url.pathname === "/api/db") {
      sendJson(res, 200, db);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/properties") {
      sendJson(res, 200, db.properties ?? []);
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/properties/")) {
      const id = Number(url.pathname.split("/").pop());

      if (!id) {
        sendJson(res, 400, { error: "Invalid property id" });
        return;
      }

      db.properties = (db.properties ?? []).filter(
        (property) => property.id !== id
      );
      db.comments = (db.comments ?? []).filter(
        (comment) => comment.propertyId !== id
      );
      db.likes = (db.likes ?? []).filter((like) => like.propertyId !== id);
      await writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/users") {
      sendJson(res, 200, db.users ?? []);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/comments") {
      sendJson(res, 200, db.comments ?? []);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/likes") {
      sendJson(res, 200, db.likes ?? []);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/comments") {
      const body = await readRequestBody(req);
      const propertyId = Number(body.propertyId);
      const text = String(body.text ?? "").trim();
      const user = String(body.user ?? "Guest User").trim() || "Guest User";

      if (!propertyId || !text) {
        sendJson(res, 400, { error: "propertyId and text are required" });
        return;
      }

      const comment = {
        id: nextId(db.comments ?? []),
        propertyId,
        user,
        text,
        createdAt: new Date().toISOString(),
      };

      db.comments = [...(db.comments ?? []), comment];
      await writeDb(db);
      sendJson(res, 201, comment);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/likes") {
      const body = await readRequestBody(req);
      const propertyId = Number(body.propertyId);
      const userId = Number(body.userId);

      if (!propertyId || !userId) {
        sendJson(res, 400, { error: "propertyId and userId are required" });
        return;
      }

      const existingLike = (db.likes ?? []).find(
        (like) => like.propertyId === propertyId && like.userId === userId
      );

      if (existingLike) {
        sendJson(res, 200, existingLike);
        return;
      }

      const like = {
        id: nextId(db.likes ?? []),
        propertyId,
        userId,
      };

      db.likes = [...(db.likes ?? []), like];
      await writeDb(db);
      sendJson(res, 201, like);
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/likes/")) {
      const id = Number(url.pathname.split("/").pop());

      if (!id) {
        sendJson(res, 400, { error: "Invalid like id" });
        return;
      }

      db.likes = (db.likes ?? []).filter((like) => like.id !== id);
      await writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/api/comments/")) {
      const id = Number(url.pathname.split("/").pop());

      if (!id) {
        sendJson(res, 400, { error: "Invalid comment id" });
        return;
      }

      db.comments = (db.comments ?? []).filter((comment) => comment.id !== id);
      await writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Server error",
    });
  }
});

server.listen(port, () => {
  console.log(`Nobzo API running on http://localhost:${port}`);
});
