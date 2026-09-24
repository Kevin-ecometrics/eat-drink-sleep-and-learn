import type { IconType } from "react-icons";
import {
  HiSparkles,
  HiUserGroup,
  HiBriefcase,
  HiBuildingOffice2,
  HiBell,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import { FaCar, FaBroom } from "react-icons/fa6";

export interface CategoryMeta {
  name: string;
  icon: IconType | null;
  text: string;
  bg: string;
  gradient: string;
  solid: string;
}

export const HOME_LOGO_PATH =
  "M0.06,2.22c-0.28-0.96,0.47-2.45,2.16-2.19c6.75,1.1,23.93,4.55,30.9,5.75c1.76,0.45,2.13,1.18,2.25,1.56c0.88,4.01,0.87,5.24,1.28,6.35s1.15,1.34,3.04,1.35c2.83,0,17.96,0.08,21.25,0.18c2.36,0.07,2.71,1.1,2.44,2.6c-0.1,0.53-0.7,3.66-0.99,5.26c-0.18,1-0.84,1.61-1.83,1.81l-20.4,4.86c-0.89,0.15-2.12-0.09-2.45-1.56c-0.51-2.22-1.16-5.43-1.53-7.04c-0.44-1.92-1.12-2.51-3.06-2.49c-5.06,0.08-21.76,1.29-23.73,1.31c-2.04,0.03-3.82-0.28-4.6-2.76C4.15,15.16,0.06,2.22,0.06,2.22";

export const CATEGORIES: CategoryMeta[] = [
  {
    name: "About us",
    icon: HiSparkles,
    text: "text-pink-600",
    bg: "bg-pink-50",
    gradient: "from-pink-500 to-rose-600",
    solid: "#db2777",
  },
  {
    name: "HR",
    icon: HiUserGroup,
    text: "text-purple-600",
    bg: "bg-purple-50",
    gradient: "from-purple-500 to-indigo-600",
    solid: "#7c3aed",
  },
  {
    name: "Service",
    icon: HiBriefcase,
    text: "text-sky-600",
    bg: "bg-sky-50",
    gradient: "from-sky-500 to-cyan-600",
    solid: "#0284c7",
  },
  {
    name: "Tower",
    icon: HiBuildingOffice2,
    text: "text-rose-600",
    bg: "bg-rose-50",
    gradient: "from-rose-500 to-pink-600",
    solid: "#e11d48",
  },
  {
    name: "Front Desk",
    icon: HiBell,
    text: "text-indigo-600",
    bg: "bg-indigo-50",
    gradient: "from-indigo-500 to-blue-600",
    solid: "#4f46e5",
  },
  {
    name: "Maintenance",
    icon: HiWrenchScrewdriver,
    text: "text-amber-600",
    bg: "bg-amber-50",
    gradient: "from-amber-500 to-orange-600",
    solid: "#d97706",
  },
  {
    name: "Valet",
    icon: FaCar,
    text: "text-red-600",
    bg: "bg-red-50",
    gradient: "from-red-500 to-rose-600",
    solid: "#dc2626",
  },
  {
    name: "Housekeeping",
    icon: FaBroom,
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    gradient: "from-emerald-500 to-teal-600",
    solid: "#059669",
  },
];

export const HOME_CATEGORY: CategoryMeta = {
  name: "Home",
  icon: null,
  text: "text-slate-700",
  bg: "bg-slate-50",
  gradient: "from-indigo-500 to-blue-600",
  solid: "#4f46e5",
};

const CATEGORY_BY_NAME: Record<string, CategoryMeta> = Object.fromEntries(
  [HOME_CATEGORY, ...CATEGORIES].map((c) => [c.name, c])
);

export function getCategoryMeta(name: string | null | undefined): CategoryMeta {
  return CATEGORY_BY_NAME[name || "Home"] || HOME_CATEGORY;
}
