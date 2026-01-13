"use client";

import AdminProtected from "@/app/components/Auth/AdminProtected";
import { usePosts } from "@/app/context/PostsContext";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  HiTrash,
  HiPencil,
  HiPlus,
  HiSearch,
  HiTag,
  HiLink,
} from "react-icons/hi";

export default function AdminPage() {
  const { posts, fetchPosts, deletePost } = usePosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar posts al montar - solución más robusta
  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        setIsLoading(true);
        await fetchPosts();
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []); // Array vacío para ejecutar solo una vez

  // Obtener categorías únicas usando useMemo
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(posts.map((p) => p.category))
    ).filter((c): c is string => c !== null);
    return ["all", ...uniqueCategories];
  }, [posts]);

  // Filtrar posts usando useMemo
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const onDelete = useCallback(
    async (id: string) => {
      const post = posts.find((p) => p.id === id);
      if (!post || !confirm(`¿Eliminar "${post.title}"?`)) return;

      setIsDeleting(id);
      try {
        await deletePost(id);
        alert("Post eliminado correctamente");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Error al eliminar el post");
      } finally {
        setIsDeleting(null);
      }
    },
    [posts, deletePost]
  );

  if (isLoading) {
    return (
      <AdminProtected>
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Cargando posts...</p>
          </div>
        </main>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Gestión de Posts
                </h1>
                <p className="text-slate-600">
                  Administra y organiza todo tu contenido
                </p>
              </div>
              <Link
                href="/admin/create"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105"
              >
                <HiPlus className="text-xl" />
                Crear Post
              </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Buscar por título o slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category Filter */}
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "Todas las categorías" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Mostrando{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredPosts.length}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold text-slate-900">
                    {posts.length}
                  </span>{" "}
                  posts
                </p>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="text-slate-400 mb-3">
                  <HiSearch className="mx-auto text-5xl" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No se encontraron posts
                </h3>
                <p className="text-slate-500">
                  {searchTerm || selectedCategory !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer post"}
                </p>
              </div>
            ) : (
              filteredPosts.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
                    isDeleting === p.id ? "opacity-50 scale-95" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 break-words">
                        {p.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <HiLink className="text-base flex-shrink-0" />
                          <span className="font-mono break-all">{p.slug}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiTag className="text-base text-blue-600 flex-shrink-0" />
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/admin/edit/${p.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                        title="Editar post"
                      >
                        <HiPencil className="text-base" />
                        <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <button
                        onClick={() => onDelete(p.id)}
                        disabled={isDeleting === p.id}
                        className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar post"
                      >
                        <HiTrash className="text-base" />
                        <span className="hidden sm:inline">
                          {isDeleting === p.id ? "Eliminando..." : "Eliminar"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </AdminProtected>
  );
}
