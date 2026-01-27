"use client";

import AdminProtected from "@/app/components/Auth/AdminProtected";
import { useState, useRef } from "react";
import { usePosts } from "@/app/context/PostsContext";
import { useRouter } from "next/navigation";
import { slugify } from "@/app/lib/supabase/slugify";
import {
  HiArrowLeft,
  HiCamera,
  HiVideoCamera,
  HiCheck,
  HiDocumentText,
  HiTag,
  HiLink,
  HiX,
  HiPlay,
} from "react-icons/hi";

// Definir las categorías disponibles (las mismas del contexto)
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

export default function AdminCreate() {
  const { createPost, uploadImage, uploadVideo } = usePosts();
  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Travel");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docxLoading, setDocxLoading] = useState(false);

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setError(null);

    // Tamaño máximo para ambos: 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validar tamaño para ambos tipos de archivo
    if (selectedFile.size > maxSize) {
      setError(
        type === "image"
          ? "La imagen es demasiado grande. Máximo permitido: 10MB"
          : "El video es demasiado grande. Máximo permitido: 10MB"
      );
      return;
    }

    // Validaciones específicas para video
    if (type === "video") {
      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Formato de video no válido. Use MP4, WebM, OGG o MOV");
        return;
      }
    }

    // Validaciones específicas para imagen
    if (type === "image") {
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedImageTypes.includes(selectedFile.type)) {
        setError("Formato de imagen no válido. Use JPG, PNG, WebP o GIF");
        return;
      }
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") {
        setImageFile(selectedFile);
        setImagePreviewUrl(reader.result as string);
      } else {
        setVideoFile(selectedFile);
        setVideoPreviewUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeMedia = (type: "image" | "video") => {
    if (type === "image") {
      setImageFile(null);
      setImagePreviewUrl(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else {
      setVideoFile(null);
      setVideoPreviewUrl(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
    setError(null);
  };

  const triggerFileInput = (type: "image" | "video") => {
    if (type === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPublishing(true);

    try {
      let imageUrl: string | undefined = undefined;
      let videoUrl: string | undefined = undefined;

      // Subir imagen si existe
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Subir video si existe
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      const slug = slugify(title);
      await createPost({
        title,
        content,
        slug,
        category,
        image_url: imageUrl ?? null,
        video_url: videoUrl ?? null,
        published: true,
      });

      router.push("/admin");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message ?? "Error al crear post");
    } finally {
      setPublishing(false);
    }
  };

  const isFormValid = title.trim() && content.trim().length >= 100;

  return (
    <AdminProtected>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header con botón de regreso */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
            >
              <HiArrowLeft className="text-xl" />
              <span className="font-medium">Volver al panel</span>
            </button>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Crear Nuevo Post
            </h1>
            <p className="text-slate-600">
              Completa la información para publicar tu contenido
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Card principal del formulario */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              {/* Título */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <HiDocumentText className="text-lg text-blue-600" />
                  Título del Post *
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Escribe un título atractivo..."
                  className="w-full border border-slate-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Un buen título debe ser claro, atractivo y descriptivo
                </p>
              </div>

              {/* Slug (auto-generado) */}
              <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <HiLink className="text-lg text-slate-500" />
                  URL del Post
                </label>
                <div className="font-mono text-sm text-slate-600 break-all">
                  {process.env.NEXT_PUBLIC_SITE_URL || "https://tusitio.com"}
                  /post/
                  <span className="text-blue-600 font-semibold">
                    {slugify(title) || "titulo-del-post"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Se genera automáticamente desde el título
                </p>
              </div>

              {/* Categoría */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <HiTag className="text-lg text-blue-600" />
                  Categoría *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        category === cat
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjunta Word */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <HiDocumentText className="text-lg text-blue-600" />
                  Importar contenido desde Word (.docx)
                </label>

                <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept=".docx"
                    onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const selected = e.target.files[0];

                      setDocxLoading(true);

                      try {
                        const formData = new FormData();
                        formData.append("file", selected);

                        const res = await fetch("/api/import-docx", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await res.json();

                        if (data.text) {
                          setContent((prev) => prev + "\n\n" + data.text);
                        } else {
                          alert("No se pudo convertir el archivo");
                        }
                      } catch (err) {
                        alert("Error al procesar el documento");
                      } finally {
                        setDocxLoading(false);
                      }
                    }}
                    className="hidden"
                    id="docxUpload"
                  />

                  <label
                    htmlFor="docxUpload"
                    className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
                  >
                    {docxLoading ? "Procesando..." : "Subir archivo Word"}
                  </label>

                  <p className="text-xs text-slate-500 mt-2">
                    El contenido se convertirá automáticamente y aparecerá en el
                    editor
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <HiDocumentText className="text-lg text-blue-600" />
                  Contenido del Post *
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el contenido de tu post aquí. Puedes usar HTML o Markdown..."
                  className="w-full border border-slate-300 p-4 rounded-xl h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-all"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">
                    {content.length} caracteres
                    {content.length < 100 && ` (mínimo 100)`}
                  </p>
                  {content.length >= 100 && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <HiCheck className="text-base" />
                      Listo para publicar
                    </span>
                  )}
                </div>
              </div>

              {/* Media - Sección separada para Imagen y Video */}
              <div className="space-y-6">
                {/* Imagen Destacada */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <HiCamera className="text-lg text-blue-600" />
                    Imagen Destacada (opcional)
                  </label>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e, "image")}
                    className="hidden"
                  />

                  {!imagePreviewUrl ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <HiCamera className="mx-auto text-4xl text-slate-400 mb-3" />
                      <button
                        type="button"
                        onClick={() => triggerFileInput("image")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Selecciona una imagen
                      </button>
                      <p className="text-xs text-slate-500 mt-2">
                        JPG, PNG, WebP o GIF • Máximo 10MB{" "}
                        {/* Cambiado a 10MB */}
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia("image")}
                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                      >
                        <HiX className="text-xl" />
                      </button>
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                        Imagen
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Destacado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <HiVideoCamera className="text-lg text-blue-600" />
                    Video Destacado (opcional)
                  </label>

                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => onFileChange(e, "video")}
                    className="hidden"
                  />

                  {!videoPreviewUrl ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <HiVideoCamera className="mx-auto text-4xl text-slate-400 mb-3" />
                      <button
                        type="button"
                        onClick={() => triggerFileInput("video")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Selecciona un video
                      </button>
                      <p className="text-xs text-slate-500 mt-2">
                        MP4, WebM, OGG o MOV • Máximo 10MB{" "}
                        {/* Cambiado a 10MB */}
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <div className="relative w-full h-64 bg-black">
                        <video
                          src={videoPreviewUrl}
                          className="w-full h-full object-contain"
                          controls
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-4">
                            <HiPlay className="text-white text-3xl" />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia("video")}
                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                      >
                        <HiX className="text-xl" />
                      </button>
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
                        Video
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mensaje de error general */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="font-semibold text-red-700 mb-1">
                  Error al crear el post
                </p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={publishing || !isFormValid}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:shadow-none"
              >
                {publishing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Publicando...
                  </>
                ) : (
                  <>
                    <HiCheck className="text-xl" />
                    Publicar Post
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="sm:w-auto px-6 py-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminProtected>
  );
}
