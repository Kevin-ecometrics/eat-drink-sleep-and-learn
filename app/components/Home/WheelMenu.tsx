/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  HiSparkles,
  HiUserGroup,
  HiBriefcase,
  HiBuildingOffice2,
  HiBell,
  HiWrenchScrewdriver
} from "react-icons/hi2";
import { FaCar, FaBroom } from "react-icons/fa6";
import type { IconType } from "react-icons";

interface Category {
  name: string;
  icon: IconType | null;
  isComponent?: boolean;
  isSvg?: boolean;
  svgPath?: string;
  textColor: string;
  bgColor: string;
  activeColor: string;
}

const categories: Category[] = [
  { 
    name: "Home", 
    icon: null, 
    isSvg: true, 
    textColor: "text-blue-600", 
    bgColor: "bg-blue-50", 
    activeColor: "from-blue-500 to-blue-600", 
    svgPath: "M0.06,2.22c-0.28-0.96,0.47-2.45,2.16-2.19c6.75,1.1,23.93,4.55,30.9,5.75c1.76,0.45,2.13,1.18,2.25,1.56c0.88,4.01,0.87,5.24,1.28,6.35s1.15,1.34,3.04,1.35c2.83,0,17.96,0.08,21.25,0.18c2.36,0.07,2.71,1.1,2.44,2.6c-0.1,0.53-0.7,3.66-0.99,5.26c-0.18,1-0.84,1.61-1.83,1.81l-20.4,4.86c-0.89,0.15-2.12-0.09-2.45-1.56c-0.51-2.22-1.16-5.43-1.53-7.04c-0.44-1.92-1.12-2.51-3.06-2.49c-5.06,0.08-21.76,1.29-23.73,1.31c-2.04,0.03-3.82-0.28-4.6-2.76C4.15,15.16,0.06,2.22,0.06,2.22" 
  },
  { name: "About us", icon: HiSparkles, isComponent: true, textColor: "text-pink-600", bgColor: "bg-pink-50", activeColor: "from-pink-500 to-pink-600" },
  { name: "HR", icon: HiUserGroup, isComponent: true, textColor: "text-purple-600", bgColor: "bg-purple-50", activeColor: "from-purple-500 to-purple-400" },
  { name: "Service", icon: HiBriefcase, isComponent: true, textColor: "text-blue-600", bgColor: "bg-blue-50", activeColor: "from-blue-500 to-blue-400" },
  { name: "Tower", icon: HiBuildingOffice2, isComponent: true, textColor: "text-pink-600", bgColor: "bg-pink-50", activeColor: "from-pink-500 to-pink-600" },
  { name: "Front Desk", icon: HiBell, isComponent: true, textColor: "text-purple-600", bgColor: "bg-purple-50", activeColor: "from-purple-500 to-purple-400" },
  { name: "Maintenance", icon: HiWrenchScrewdriver, isComponent: true, textColor: "text-orange-600", bgColor: "bg-orange-50", activeColor: "from-orange-500 to-orange-400" },
  { name: "Valet", icon: FaCar, isComponent: true, textColor: "text-red-600", bgColor: "bg-red-50", activeColor: "from-red-500 to-red-600" },
  { name: "Housekeeping", icon: FaBroom, isComponent: true, textColor: "text-green-600", bgColor: "bg-green-50", activeColor: "from-green-500 to-green-600" },
];

interface WheelMenuProps {
  onCategoryClick: (category: string) => void;
  activeCategory: string | null;
  onHomeClick: () => void;
}

// Helper function to render icons safely
const renderIcon = (category: Category, isActive: boolean = false) => {
  if (category.isSvg && category.svgPath) {
    return (
      <svg viewBox="0 0 63.45 29.79" className="w-6 h-6" fill="currentColor">
        <path d={category.svgPath} />
      </svg>
    );
  }
  
  if (category.isComponent && category.icon) {
    const Icon = category.icon;
    return <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />;
  }
  
  return <span className="text-3xl">
    {category.icon ? <category.icon /> : null}
  </span>;
};

export default function EnhancedWheelMenu({ 
  onCategoryClick, 
  activeCategory, 
  onHomeClick 
}: WheelMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotation: 0 });

  const currentCategory = activeCategory || "Home";
  const activeIndex = categories.findIndex(cat => cat.name === currentCategory);
  const activeColor = categories[activeIndex]?.activeColor || categories[0].activeColor;

  useEffect(() => {
    const categoryIndex = categories.findIndex(cat => cat.name === currentCategory);
    if (categoryIndex !== -1 && !isDragging) {
      const targetRotation = -categoryIndex * (360 / categories.length);
      setRotation(targetRotation);
    }
  }, [currentCategory, isDragging]);

  const handleCategorySelect = useCallback((categoryName: string) => {
    if (categoryName === "Home") {
      onHomeClick();
    } else {
      onCategoryClick(categoryName);
    }
  }, [onHomeClick, onCategoryClick]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotation: rotation
    });
  }, [rotation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const rotationDelta = deltaX * 0.5;
    const newRotation = dragStart.rotation + rotationDelta;
    setRotation(newRotation);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const step = 360 / categories.length;
    const normalizedRotation = (((-rotation) % 360) + 360) % 360;
    const nearestIndex = Math.round(normalizedRotation / step) % categories.length;
    const snappedRotation = -nearestIndex * step;
    
    setRotation(snappedRotation);
    
    const newCategory = categories[nearestIndex];
    if (newCategory.name === "Home") {
      onHomeClick();
    } else {
      onCategoryClick(newCategory.name);
    }
  }, [isDragging, rotation, onHomeClick, onCategoryClick]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-start justify-center p-8">
      <div className="space-y-8">
        {/* Contenedor principal de la rueda */}
        <div className="relative">
          {/* Rueda mejorada con drag */}
          <div 
            className="relative w-96 h-96 mx-auto cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Fondo con efecto de resplandor */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeColor} opacity-5 blur-3xl`}></div>
            
            {/* Círculos concéntricos animados */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-200/50 animate-pulse" 
                 style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-6 rounded-full border-2 border-gray-200/30"></div>
            <div className="absolute inset-12 rounded-full border border-gray-200/20"></div>
            
            {/* Anillo exterior decorativo rotante */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                background: `linear-gradient(white, white) padding-box, linear-gradient(${rotation}deg, transparent 0%, rgba(147, 197, 253, 0.3) 50%, transparent 100%) border-box`,
                transform: `rotate(${-rotation * 0.5}deg)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            ></div>
            
            {/* Elementos de categoría mejorados */}
            {categories.map((category, index) => {
              const total = categories.length;
              const angle = (index * 2 * Math.PI) / total + (rotation * Math.PI / 180);
              const radius = 130;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              
              const isActive = activeCategory === category.name || 
                (!activeCategory && category.name === "Home");
              const isHovered = hoveredCategory === category.name;
              
              return (
                <div
                  key={category.name}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive ? 40 : isHovered ? 35 : 30,
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {/* Efecto de halo para elemento activo */}
                  {isActive && (
                    <div className={`absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-br ${category.activeColor} opacity-20 blur-xl animate-pulse`}></div>
                  )}
                  
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`relative w-16 h-16 transition-all duration-500 ease-out flex items-center justify-center rounded-full ${
                      isActive 
                        ? `bg-gradient-to-br ${category.activeColor} text-white shadow-2xl scale-125 ring-4 ring-white` 
                        : `${category.bgColor} ${category.textColor} hover:scale-110 shadow-lg border-2 border-gray-100 ${isHovered ? 'shadow-2xl scale-110 ring-2 ring-gray-300' : ''}`
                    }`}
                    title={category.name}
                  >
                    <span className={`transition-all duration-300 ${(isHovered || isActive) ? 'scale-110' : ''}`}>
                      {renderIcon(category, isActive)}
                    </span>
                    
                    {/* Efecto de pulso para el activo */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" 
                        style={{ animationDuration: '2s' }}
                      ></div>
                    )}
                  </button>
                  
                  {/* Etiqueta de categoría */}
                  {showLabels && !isActive && (
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg bg-white text-gray-700 border border-gray-200`}>
                        {category.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Centro mejorado con información dinámica */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br ${activeColor} rounded-full flex items-center justify-center border-4 border-white shadow-2xl z-50 transition-all duration-500`}>
              <div className="text-center text-white flex flex-col items-center">
                <div className="mb-1">
                  {categories[activeIndex] && renderIcon(categories[activeIndex], true)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                  {currentCategory}
                </div>
              </div>
              
              {/* Anillo giratorio del centro */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-white border-dashed opacity-30"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.5s ease-out'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Controles adicionales */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-sm font-medium text-gray-700 shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            {showLabels ? '🏷️ Hide Labels' : '🏷️ Show Labels'}
          </button>
          <button
            onClick={onHomeClick}
            className={`px-4 py-2 bg-gradient-to-r ${activeColor} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all`}
          >
            🏠 Reset to Home
          </button>
        </div>

        {/* Indicadores de categorías en la parte inferior */}
        <div className="flex justify-center gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex 
                  ? `${cat.bgColor} scale-150 shadow-lg` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={cat.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}