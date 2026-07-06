import { create } from "zustand";
import type { Comment, Like, Property, User } from "../types";
import {
  createComment,
  createLike,
  deleteLike,
  deleteProperty,
  getDb,
} from "../services/propertyService";

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  properties: Property[];
  comments: Comment[];
  likes: Like[];
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setProperties: (properties: Property[]) => void;
  loadSocialData: () => Promise<void>;
  toggleLike: (propertyId: number) => Promise<void>;
  addComment: (propertyId: number, text: string) => Promise<void>;
  removeProperty: (propertyId: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

interface SocialCache {
  comments: Comment[];
  likes: Like[];
}

function getSavedUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("nobzo-user");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
}

function getSavedSocialData(): SocialCache | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("nobzo-social");
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as SocialCache;
  } catch {
    return null;
  }
}

function persistSocialData(data: SocialCache) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("nobzo-social", JSON.stringify(data));
}

function mergeById<T extends { id: number }>(current: T[], incoming: T[]) {
  const map = new Map<number, T>();

  for (const item of current) {
    map.set(item.id, item);
  }

  for (const item of incoming) {
    map.set(item.id, item);
  }

  return Array.from(map.values());
}

const savedUser = getSavedUser();
const savedSocialData = getSavedSocialData();

export const useStore = create<StoreState>((set, get) => ({
  user: savedUser,
  isAuthenticated: Boolean(savedUser),
  properties: [],
  comments: savedSocialData?.comments ?? [],
  likes: savedSocialData?.likes ?? [],
  loading: false,
  login: (user) => {
    localStorage.setItem("nobzo-user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("nobzo-user");
    set({ user: null, isAuthenticated: false });
  },
  setProperties: (properties) => set({ properties }),
  loadSocialData: async () => {
    const db = await getDb();
    set((state) => ({
      comments: mergeById(state.comments, db.comments),
      likes: mergeById(state.likes, db.likes),
    }));
    persistSocialData({
      comments: mergeById(get().comments, db.comments),
      likes: mergeById(get().likes, db.likes),
    });
  },
  toggleLike: async (propertyId) => {
    const state = get();
    const currentUserId = state.user?.id;

    if (!currentUserId) {
      return;
    }

    const existingLike = state.likes.find(
      (like) => like.propertyId === propertyId && like.userId === currentUserId
    );

    if (existingLike) {
      const nextLikes = state.likes.filter((like) => like.id !== existingLike.id);

      set({
        likes: nextLikes,
      });
      persistSocialData({
        comments: get().comments,
        likes: nextLikes,
      });

      try {
        await deleteLike(existingLike.id);
      } catch {
        // Keep the optimistic update even if the API is unavailable.
      }
      return;
    }

    const optimisticLike: Like = {
      id: Date.now(),
      propertyId,
      userId: currentUserId,
    };

    const nextLikes = [...state.likes, optimisticLike];

    set({
      likes: nextLikes,
    });
    persistSocialData({
      comments: get().comments,
      likes: nextLikes,
    });

    try {
      const createdLike = await createLike({
        propertyId,
        userId: currentUserId,
      });

      set((currentState) => ({
        likes: currentState.likes.map((like) =>
          like.id === optimisticLike.id ? createdLike : like
        ),
      }));
      persistSocialData({
        comments: get().comments,
        likes: get().likes,
      });
    } catch {
      // Keep the optimistic like in the UI and local cache.
    }
  },
  addComment: async (propertyId, text) => {
    const state = get();
    const author = state.user?.name ?? "Guest User";
    const optimisticComment: Comment = {
      id: Date.now(),
      propertyId,
      user: author,
      text,
      createdAt: new Date().toISOString(),
    };

    const nextComments = [...state.comments, optimisticComment];

    set({
      comments: nextComments,
    });
    persistSocialData({
      comments: nextComments,
      likes: get().likes,
    });

    try {
      const createdComment = await createComment({
        propertyId,
        text,
        user: author,
      });

      set((currentState) => ({
        comments: currentState.comments.map((comment) =>
          comment.id === optimisticComment.id ? createdComment : comment
        ),
      }));
      persistSocialData({
        comments: get().comments,
        likes: get().likes,
      });
    } catch {
      // Keep the optimistic comment in the UI and local cache.
    }
  },
  removeProperty: async (propertyId) => {
    const state = get();
    const previousState = {
      properties: state.properties,
      comments: state.comments,
      likes: state.likes,
    };

    const nextProperties = state.properties.filter(
      (property) => property.id !== propertyId
    );
    const nextComments = state.comments.filter(
      (comment) => comment.propertyId !== propertyId
    );
    const nextLikes = state.likes.filter((like) => like.propertyId !== propertyId);

    set({
      properties: nextProperties,
      comments: nextComments,
      likes: nextLikes,
    });
    persistSocialData({
      comments: nextComments,
      likes: nextLikes,
    });

    try {
      await deleteProperty(propertyId);
    } catch {
      // Keep the optimistic removal in the UI and local cache.
    }
  },
  setLoading: (loading) => set({ loading }),
}));
