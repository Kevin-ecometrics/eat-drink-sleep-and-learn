/* eslint-disable react-hooks/purity */
// app/post/[slug]/page.tsx - ENHANCED VERSION
import { createClient } from "@/app/lib/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import type { Database } from "@/app/lib/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface PostContentProps {
  params: {
    slug: string;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  category: string | null;
}

// Mapeo de categorías a colores
const categoryColors: {
  [key: string]: { gradient: string; bg: string; text: string };
} = {
  Home: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  Fashion: {
    gradient: "from-pink-500 to-rose-600",
    bg: "bg-pink-100",
    text: "text-pink-700",
  },
  Technology: {
    gradient: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
  },
  Travel: {
    gradient: "from-sky-500 to-cyan-600",
    bg: "bg-sky-100",
    text: "text-sky-700",
  },
  Food: {
    gradient: "from-orange-500 to-amber-600",
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  Photography: {
    gradient: "from-violet-500 to-fuchsia-600",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  Lifestyle: {
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
};

// Iconos de categoría
const categoryIcons: { [key: string]: string } = {
  Home: "🏠",
  Fashion: "👗",
  Technology: "💻",
  Travel: "✈️",
  Food: "🍕",
  Photography: "📷",
  Lifestyle: "🌟",
};

async function PostContent({ params }: PostContentProps) {
  const supabase = createClient();
  const { slug } = params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single<Post>();

  if (error || !post) {
    notFound();
  }

  // Obtener posts relacionados
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title, slug, created_at, category")
    .eq("published", true)
    .eq("category", post.category || "")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<RelatedPost[]>();

  const typedRelatedPosts: RelatedPost[] = (relatedPosts || []).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    created_at: post.created_at,
    category: post.category,
  }));

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryStyle = (category: string | null) => {
    return categoryColors[category || "Home"] || categoryColors.Home;
  };

  const categoryStyle = getCategoryStyle(post.category);
  const categoryIcon = categoryIcons[post.category || "Home"] || "📝";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb mejorado */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-full text-gray-600 hover:text-gray-900 transition-all shadow-sm hover:shadow-md font-medium"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <svg
            className="w-4 h-4 text-gray-400"
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
          <span className="px-3 py-1.5 bg-white rounded-full text-gray-800 font-medium shadow-sm">
            {post.category || "Article"}
          </span>
        </nav>

        {/* Contenedor principal del artículo */}
        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Imagen destacada mejorada */}
          {post.image_url && (
            <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              <img
                src={post.image_url}
                alt={post.title}
                className="
    w-full 
    h-full 
    object-cover 
    hover:scale-105 
    transition-transform 
    duration-700 
    rounded-xl
  "
                loading="eager"
              />

              {/* Badge de categoría sobre la imagen */}
              <div className="absolute top-6 left-6 z-20">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${categoryStyle.gradient} rounded-full text-white font-bold text-sm shadow-xl backdrop-blur-sm`}
                >
                  <span className="text-lg">{categoryIcon}</span>
                  {post.category}
                </div>
              </div>
            </div>
          )}

          {/* Contenido del artículo */}
          <div className="p-8 md:p-12">
            {/* Encabezado del post */}
            <header className="mb-10 border-b border-gray-100 pb-8">
              {/* Categoría si no hay imagen */}
              {!post.image_url && post.category && (
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${categoryStyle.gradient} rounded-full text-white font-bold text-sm shadow-lg`}
                  >
                    <span className="text-lg">{categoryIcon}</span>
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {/* Fecha */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(post.created_at)}
                  </span>
                </div>

                {/* Tiempo de lectura estimado */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.ceil(post.content.split(" ").length / 200)} min read
                  </span>
                </div>

                {/* Vistas */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                  <svg
                    className="w-4 h-4 text-gray-500"
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
                  <span className="text-sm font-medium text-gray-700">
                    {Math.floor(Math.random() * 1000) + 200} views
                  </span>
                </div>

                {/* Comentarios */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    5 Comments
                  </span>
                </div>
              </div>
            </header>

            {/* Contenido del post mejorado */}
            <div className="prose prose-lg prose-gray max-w-none mb-16">
              {post.video_url && (
                <video
                  src={`${post.video_url}`}
                  controls
                  autoPlay
                  muted
                  className="
    w-full 
    h-[70vh] 
    min-h-[500px] 
    max-h-[800px] 
    object-cover 
    bg-black
    shadow-2xl
    rounded-3xl
    mb-8
  "
                >
                  Tu navegador no soporta el elemento de video.
                </video>
              )}

              <div className="text-gray-700 leading-relaxed space-y-6">
                {post.content.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p key={index} className="text-lg leading-loose">
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </div>

            {/* Acciones del post */}
            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${categoryStyle.gradient} text-white rounded-full font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Like</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {Math.floor(Math.random() * 100) + 10}
                  </span>
                </button>

                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Save
                </button>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>

            {/* Posts relacionados mejorados */}
            {typedRelatedPosts.length > 0 && (
              <section className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className={`w-1 h-8 bg-gradient-to-b ${categoryStyle.gradient} rounded-full`}
                  ></div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Related Articles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {typedRelatedPosts.map((relatedPost) => {
                    const relatedStyle = getCategoryStyle(relatedPost.category);
                    const relatedIcon =
                      categoryIcons[relatedPost.category || "Home"] || "📝";

                    return (
                      <div
                        key={relatedPost.id}
                        className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        {/* Badge de categoría */}
                        {relatedPost.category && (
                          <div className="mb-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${relatedStyle.gradient} rounded-full text-white text-xs font-bold shadow-md`}
                            >
                              <span>{relatedIcon}</span>
                              {relatedPost.category}
                            </span>
                          </div>
                        )}

                        <Link href={`/post/${relatedPost.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {relatedPost.title}
                          </h3>
                        </Link>

                        <div className="flex items-center text-xs text-gray-500 mb-4">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{formatDate(relatedPost.created_at)}</span>
                        </div>

                        <Link
                          href={`/post/${relatedPost.slug}`}
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${relatedStyle.gradient} text-white rounded-full font-semibold text-sm hover:scale-105 transition-all shadow-md hover:shadow-lg`}
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
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </article>

        {/* Botón para volver mejorado */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${categoryStyle.gradient} text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente principal de la página
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 md:p-12">
              {/* Skeleton loading mejorado */}
              <div className="space-y-8 animate-pulse">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                <div className="flex gap-3">
                  <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                </div>
                <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-9/12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PostContent params={{ slug }} />
    </Suspense>
  );
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true)
    .throwOnError()
    .returns<{ slug: string }[]>();

  if (!posts) {
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
