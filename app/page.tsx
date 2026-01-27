// app/page.tsx - ENHANCED VERSION (CORREGIDO)
"use client";

import { useState, useEffect, useRef } from "react";
import CategoriesSidebar from "./components/Home/CategoriesSidebar";
import SearchBar from "./components/Home/SearchBar";
import WheelMenu from "./components/Home/WheelMenu";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import type { Database } from "@/app/lib/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "search" | "category">(
    "all"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar posts iniciales
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar búsqueda con transición
  const handleSearch = (query: string) => {
    // Limpiar timeout anterior si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    if (!query.trim()) {
      resetView();
      return;
    }

    setIsTransitioning(true);
    setSelectedCategory(null);
    setViewMode("search");

    // Usar debounce para evitar múltiples renders
    searchTimeoutRef.current = setTimeout(() => {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          (post.category &&
            post.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPosts(filtered);
      setIsTransitioning(false);
    }, 300);
  };

  // Función para manejar clic en categoría con transición
  const handleCategoryClick = (categoryName: string) => {
    // Limpiar timeout de búsqueda si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsTransitioning(true);
    setSelectedCategory(categoryName);
    setSearchQuery("");
    setViewMode("category");

    // Filtrar inmediatamente sin delay
    const filtered = posts.filter((post) => post.category === categoryName);
    setFilteredPosts(filtered);

    // Pequeño delay para la transición visual
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Función para resetear a vista principal con transición
  const resetView = () => {
    // Limpiar timeout de búsqueda si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsTransitioning(true);
    setViewMode("all");
    setSearchQuery("");
    setSelectedCategory(null);

    // Restaurar posts inmediatamente
    setFilteredPosts(posts);

    // Pequeño delay para la transición visual
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Obtener color de categoría activa
  const getCategoryColor = () => {
    const categoryColors: { [key: string]: string } = {
      Home: "from-blue-500 to-blue-600",
      "About us": "from-pink-500 to-rose-600",
      HR: "from-indigo-500 to-purple-600",
      Service: "from-sky-500 to-cyan-600",
      Tower: "from-pink-500 to-rose-600",
      "Front Desk": "from-purple-500 to-purple-600",
      Maintenance: "from-orange-500 to-amber-600",
      Valet: "from-red-500 to-red-600",
      Housekeeping: "from-green-500 to-teal-600",
    };
    return categoryColors[selectedCategory || "Home"] || categoryColors.Home;
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* COLUMNA 1: NAVEGACIÓN CON RUEDA MEJORADA */}
          <div className="lg:w-md">
            <div className="sticky top-8 space-y-4">
              {/* Header del blog */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 63.45 29.79" role="img" aria-label="Logo" className="w-16 h-auto flex-shrink-0">
                    <path d="M0.06,2.22c-0.28-0.96,0.47-2.45,2.16-2.19c6.75,1.1,23.93,4.55,30.9,5.75c1.76,0.45,2.13,1.18,2.25,1.56c0.88,4.01,0.87,5.24,1.28,6.35s1.15,1.34,3.04,1.35c2.83,0,17.96,0.08,21.25,0.18c2.36,0.07,2.71,1.1,2.44,2.6c-0.1,0.53-0.7,3.66-0.99,5.26c-0.18,1-0.84,1.61-1.83,1.81l-20.4,4.86c-0.89,0.15-2.12-0.09-2.45-1.56c-0.51-2.22-1.16-5.43-1.53-7.04c-0.44-1.92-1.12-2.51-3.06-2.49c-5.06,0.08-21.76,1.29-23.73,1.31c-2.04,0.03-3.82-0.28-4.6-2.76C4.15,15.16,0.06,2.22,0.06,2.22" />
                  </svg>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      My Blog
                    </h1>
                    <p className="text-sm text-gray-500">Personal Stories</p>
                  </div>
                </div>
              </div>

              {/* MENÚ DE RUEDA MEJORADO */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                  Navigation Wheel
                </h3>
                <WheelMenu
                  onCategoryClick={handleCategoryClick}
                  activeCategory={selectedCategory}
                  onHomeClick={resetView}
                />
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 space-y-1">
                <p>&copy; {new Date().getFullYear()} My Blog</p>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: CONTENIDO PRINCIPAL MEJORADO */}
          <div className="lg:flex-1 lg:max-w-3xl">
            {/* Encabezado dinámico con animación */}
            <div
              className={`mb-8 transition-all duration-300 ${
                isTransitioning
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {viewMode === "all" && (
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                    Latest Posts
                  </h2>
                  <p className="text-gray-600">
                    Discover our most recent articles and stories
                  </p>
                </div>
              )}

              {viewMode === "search" && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🔍</span>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Search Results
                        </h2>
                      </div>
                      <p className="text-gray-600">
                        Found{" "}
                        <span className="font-semibold text-blue-600">
                          {filteredPosts.length}
                        </span>{" "}
                        result
                        {filteredPosts.length !== 1 ? "s" : ""} for{" "}
                        {searchQuery}
                      </p>
                    </div>
                    <button
                      onClick={resetView}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-all hover:scale-105"
                    >
                      ✕ Clear
                    </button>
                  </div>
                </div>
              )}

              {viewMode === "category" && (
                <div
                  className={`bg-gradient-to-r ${getCategoryColor()} rounded-2xl shadow-lg p-6 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">
                        {selectedCategory}
                      </h2>
                      <p className="text-white/90">
                        {filteredPosts.length} article
                        {filteredPosts.length !== 1 ? "s" : ""} in this category
                      </p>
                    </div>
                    <button
                      onClick={resetView}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-all hover:scale-105"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Estado de carga mejorado */}
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-pulse"
                  >
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5 mb-6"></div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                      <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full w-24"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full w-32 mt-6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Mostrar posts con animación */}
                {filteredPosts.length === 0 ? (
                  <div
                    className={`bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100 transition-all duration-300 ${
                      isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="text-6xl mb-4">
                      {viewMode === "search"
                        ? "🔍"
                        : viewMode === "category"
                        ? "📭"
                        : "📝"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {viewMode === "search"
                        ? "No Results Found"
                        : viewMode === "category"
                        ? "No Posts Yet"
                        : "No Posts Available"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {viewMode === "search"
                        ? `We couldn't find any posts matching "${searchQuery}"`
                        : viewMode === "category"
                        ? `There are no posts in "${selectedCategory}" yet`
                        : "No posts have been published yet"}
                    </p>
                    <button
                      onClick={resetView}
                      className={`px-6 py-3 bg-gradient-to-r ${getCategoryColor()} text-white rounded-full font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      ← Explore All Posts
                    </button>
                  </div>
                ) : (
                  <div
                    className={`space-y-8 transition-all duration-300 ${
                      isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {filteredPosts.map((post, index) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-gray-100 transition-all duration-300 hover:scale-[1.02] group"
                      >
                        {/* Categoría tag */}
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`inline-flex items-center justify-center px-4 py-1.5 bg-gradient-to-r ${getCategoryColor()} text-white rounded-full text-xs font-bold shadow-md`}
                          >
                            {post.category || "Uncategorized"}
                          </span>
                          <span className="text-sm text-gray-500 hidden">
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-auto object-cover rounded-xl mb-6 border border-gray-200 shadow-sm"
                          />
                        )}

                        {/* Título */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                          <Link href={`/post/${post.slug}`}>{post.title}</Link>
                        </h2>

                        {/* Contenido preview */}
                        <p className="text-gray-700 mb-6 leading-relaxed text-base">
                          {post.content && post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content || "No content available"}
                        </p>

                        {/* Footer del post */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <Link
                            href={`/post/${post.slug}`}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${getCategoryColor()} text-white rounded-full font-semibold text-sm transition-all hover:scale-105 shadow-md hover:shadow-lg`}
                          >
                            Read More
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              124
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              5
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* COLUMNA 3: SIDEBAR DERECHA MEJORADA */}
          <div className="lg:w-80">
            <div className="sticky top-8 space-y-6">
              {/* Buscador mejorado */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔍</span>
                  <h3 className="text-lg font-bold text-gray-800">Search</h3>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>

              {/* Artículos Populares mejorados */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🔥</span>
                  <h3 className="text-lg font-bold text-gray-800">Trending</h3>
                </div>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post, index) => (
                    <div
                      key={post.id}
                      className="group pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/post/${post.slug}`}>
                            <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h4>
                          </Link>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="hidden">
                              {new Date(post.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-blue-600 font-medium">
                              {Math.floor(Math.random() * 500) + 100} views
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter card */}
              <div
                className={`bg-gradient-to-br ${getCategoryColor()} rounded-2xl shadow-lg p-6 text-white`}
              >
                <div className="text-3xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-white/90 text-sm mb-4">
                  Subscribe to get our latest articles delivered to your inbox.
                </p>
                <button className="w-full bg-white text-gray-800 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-md">
                  Subscribe Now
                </button>
              </div>

              {/* Categorías mejoradas */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📂</span>
                  <h3 className="text-lg font-bold text-gray-800">
                    Categories
                  </h3>
                </div>
                <CategoriesSidebar
                  onCategoryClick={handleCategoryClick}
                  activeCategory={selectedCategory}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
