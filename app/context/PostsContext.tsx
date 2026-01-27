"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/app/lib/supabase/client";
import type { Database } from "@/app/lib/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type InsertPost = Database["public"]["Tables"]["posts"]["Insert"];
type UpdatePost = Database["public"]["Tables"]["posts"]["Update"];

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (data: InsertPost) => Promise<Post>;
  updatePost: (id: string, data: UpdatePost) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  uploadVideo: (file: File) => Promise<string>;
  getCategories: () => string[];
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Categorías disponibles (mismas que en la imagen)
const AVAILABLE_CATEGORIES = [
  "About us",
  "HR",
  "Service",
  "Tower",
  "Front Desk",
  "Maintenance",
  "Valet",
  "Housekeeping",
];

// Formatos permitidos para imágenes
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Formatos permitidos para videos
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

// Tamaño máximo para ambos: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtener todos los posts
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) throw error;
    setPosts(data as Post[]);
  };

  // Crear post
  const createPost = async (payload: InsertPost): Promise<Post> => {
    const { data, error } = await supabase
      .from("posts")
      .insert(payload as never)
      .select()
      .single();
    if (error) throw error;
    setPosts((prev) => [data, ...prev]);
    return data;
  };

  // Actualizar
  const updatePost = async (id: string, updates: UpdatePost): Promise<Post> => {
    const { data, error } = await supabase
      .from("posts")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setPosts((prev) => prev.map((p) => (p.id === id ? data : p)));
    return data;
  };

  // Eliminar
  const deletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Subir imagen (Storage bucket "posts-images")
  const uploadImage = async (file: File): Promise<string> => {
    // Validar tipo de archivo
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Formato de imagen no válido. Use JPG, PNG, WebP o GIF");
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("La imagen es demasiado grande. Máximo permitido: 10MB");
    }

    const fileName = `images/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage
      .from("posts-images")
      .upload(fileName, file, {
        upsert: false,
        cacheControl: "3600",
      });

    if (error) throw error;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts-images").getPublicUrl(fileName);

    return publicUrl;
  };

  // Subir video (Storage bucket "posts-images") - Mismo bucket
  const uploadVideo = async (file: File): Promise<string> => {
    // Validar tipo de archivo
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      throw new Error("Formato de video no válido. Use MP4, WebM, OGG o MOV");
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El video es demasiado grande. Máximo permitido: 10MB");
    }

    const fileName = `videos/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage
      .from("posts-images") // Mismo bucket que las imágenes
      .upload(fileName, file, {
        upsert: false,
        cacheControl: "3600",
      });

    if (error) throw error;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("posts-images").getPublicUrl(fileName);

    return publicUrl;
  };

  // Obtener lista de categorías disponibles
  const getCategories = () => {
    return AVAILABLE_CATEGORIES;
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        createPost,
        updatePost,
        deletePost,
        uploadImage,
        uploadVideo,
        getCategories,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts debe usarse dentro de <PostsProvider>");
  return ctx;
}
