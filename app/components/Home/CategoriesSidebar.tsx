/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/Home/CategoriesSidebar.tsx - CLIENT COMPONENT MEJORADO
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import type { Database } from "@/app/lib/supabase/types";
import { 
  HiTag, 
  HiSparkles,
  HiUserGroup,
  HiBriefcase,
  HiBuildingOffice2,
  HiBell,
  HiWrenchScrewdriver
} from "react-icons/hi2";
import { FaCar, FaBroom } from "react-icons/fa6";

type PostCategoryRow = Pick<
  Database["public"]["Tables"]["posts"]["Row"],
  "category"
>;

interface CategoriesSidebarProps {
  onCategoryClick: (categoryName: string) => void;
  activeCategory: string | null;
}

// Iconos y colores por categoría
const categoryConfig: Record<string, { icon: any; color: string; bgColor: string; activeColor: string }> = {
  "About us": { 
    icon: HiSparkles, 
    color: "text-pink-600", 
    bgColor: "bg-pink-50",
    activeColor: "from-pink-500 to-pink-600"
  },
  HR: { 
    icon: HiUserGroup, 
    color: "text-purple-600", 
    bgColor: "bg-purple-50",
    activeColor: "from-purple-500 to-purple-400"
  },
  Service: { 
    icon: HiBriefcase, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50",
    activeColor: "from-blue-500 to-blue-400"
  },
  "Tower": { 
    icon: HiBuildingOffice2, 
    color: "text-pink-600", 
    bgColor: "bg-pink-50",
    activeColor: "from-pink-500 to-pink-600"
  },
  "Front Desk": { 
    icon: HiBell, 
    color: "text-purple-600", 
    bgColor: "bg-purple-50",
    activeColor: "from-purple-500 to-purple-400"
  },
  "Maintenance": { 
    icon: HiWrenchScrewdriver, 
    color: "text-orange-600", 
    bgColor: "bg-orange-50",
    activeColor: "from-orange-500 to-orange-400"
  },
  "Valet": { 
    icon: FaCar, 
    color: "text-red-600", 
    bgColor: "bg-red-50",
    activeColor: "from-red-500 to-red-600"
  },
  "Housekeeping": { 
    icon: FaBroom, 
    color: "text-green-600", 
    bgColor: "bg-green-50",
    activeColor: "from-green-500 to-green-600"
  },
};

export default function CategoriesSidebar({
  onCategoryClick,
  activeCategory,
}: CategoriesSidebarProps) {
  const [categories, setCategories] = useState<
    { name: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const supabase = createClient();

      const { data: posts, error } = await supabase
        .from("posts")
        .select("category")
        .eq("published", true)
        .returns<PostCategoryRow[]>();

      if (error) throw error;

      const counts: Record<string, number> = {};

      posts?.forEach((post) => {
        const category = post.category;
        if (category && category.trim() !== "") {
          counts[category] = (counts[category] || 0) + 1;
        }
      });

      const allCategories = [
        "About us",
        "HR",
        "Service",
        "Tower",
        "Front Desk",
        "Maintenance",
        "Valet",
        "Housekeeping",
      ];

      const categoriesWithCounts = allCategories.map((name) => ({
        name,
        count: counts[name] || 0,
      }));

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 animate-pulse"
            >
              <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <HiTag className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Categorías</h3>
          <p className="text-xs text-slate-500">{totalPosts} artículos</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => {
          const config = categoryConfig[category.name];
          const Icon = config?.icon || HiTag;
          const isActive = activeCategory === category.name;

          return (
            <button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? `bg-gradient-to-r ${config?.activeColor} shadow-md scale-105`
                  : "hover:bg-slate-50 hover:scale-102"
              }`}
            >
              {/* Icon */}
              <div
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white/20"
                    : `${config?.bgColor} group-hover:scale-110`
                }`}
              >
                <Icon
                  className={`text-xl ${
                    isActive ? "text-white" : config?.color
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div
                  className={`font-semibold text-sm ${
                    isActive ? "text-white" : "text-slate-900"
                  }`}
                >
                  {category.name}
                </div>
                <div
                  className={`text-xs ${
                    isActive ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {category.count} {category.count === 1 ? "post" : "posts"}
                </div>
              </div>

              {/* Count Badge */}
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}
              >
                {category.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Total de posts</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
            {totalPosts}
          </span>
        </div>
      </div>
    </div>
  );
}