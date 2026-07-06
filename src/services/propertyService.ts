import db from "../data/db.json";
import type { Comment, Like, Property, User } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function requestOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    return await request<T>(path);
  } catch {
    return fallback;
  }
}

export async function getProperties() {
  return requestOrFallback("/properties", db.properties as Property[]);
}

export async function getPropertyById(id: number) {
  const properties = await getProperties();
  return properties.find((item) => item.id === id) ?? null;
}

export async function getCommentsByPropertyId(propertyId: number) {
  const comments = await requestOrFallback(
    "/comments",
    db.comments as Comment[]
  );
  return comments.filter((item) => item.propertyId === propertyId);
}

export async function getUsers() {
  return requestOrFallback("/users", db.users as User[]);
}

export async function getLikes() {
  return requestOrFallback("/likes", db.likes as Like[]);
}

export async function getDb() {
  return requestOrFallback("/db", db as {
    users: User[];
    properties: Property[];
    comments: Comment[];
    likes: Like[];
  });
}

export async function createComment(payload: {
  propertyId: number;
  text: string;
  user: string;
}) {
  return request<Comment>("/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createLike(payload: { propertyId: number; userId: number }) {
  return request<Like>("/likes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteLike(id: number) {
  return request<{ ok: boolean }>(`/likes/${id}`, {
    method: "DELETE",
  });
}

export async function deleteProperty(id: number) {
  return request<{ ok: boolean }>(`/properties/${id}`, {
    method: "DELETE",
  });
}
