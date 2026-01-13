"use client";

import { useState, useEffect } from "react";

const categories = [
  { name: "Home", icon: "🏠", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-500" },
  { name: "Fashion", icon: "👗", color: "from-pink-500 to-rose-600", bgColor: "bg-pink-500" },
  { name: "Technology", icon: "💻", color: "from-indigo-500 to-purple-600", bgColor: "bg-indigo-500" },
  { name: "Travel", icon: "✈️", color: "from-sky-500 to-cyan-600", bgColor: "bg-sky-500" },
  { name: "Food", icon: "🍕", color: "from-orange-500 to-amber-600", bgColor: "bg-orange-500" },
  { name: "Photography", icon: "📷", color: "from-violet-500 to-fuchsia-600", bgColor: "bg-violet-500" },
  { name: "Lifestyle", icon: "🌟", color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-500" },
];

interface WheelMenuProps {
  onCategoryClick: (category: string) => void;
  activeCategory: string | null;
  onHomeClick: () => void;
}

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
  const activeColor = categories[activeIndex]?.color || categories[0].color;

  useEffect(() => {
    const categoryIndex = categories.findIndex(cat => cat.name === currentCategory);
    if (categoryIndex !== -1 && !isDragging) {
      const targetRotation = -categoryIndex * (360 / categories.length);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRotation(targetRotation);
    }
  }, [currentCategory, isDragging]);

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === "Home") {
      onHomeClick();
    } else {
      onCategoryClick(categoryName);
    }
  };



  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotation: rotation
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const rotationDelta = deltaX * 0.5;
    const newRotation = dragStart.rotation + rotationDelta;
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
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
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-start justify-center p-8">
      <div className="space-y-8">
        {/* Header con información de categoría activa */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${activeColor} rounded-full shadow-lg text-white`}>
            <span className="text-2xl">{categories[activeIndex]?.icon}</span>
            <span className="font-bold text-lg">{currentCategory}</span>
          </div>
          <p className="text-sm text-gray-500">Drag, click arrows, or select a category</p>
        </div>

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
            
            {/* Líneas radiales dinámicas */}
            {categories.map((category, index) => {
              const angle = (index * 360) / categories.length;
              const isActiveSegment = index === activeIndex;
              return (
                <div
                  key={`line-${index}`}
                  className={`absolute top-1/2 left-1/2 w-1 h-28 transition-all duration-500 ${
                    isActiveSegment 
                      ? `bg-gradient-to-t from-transparent via-${category.bgColor} to-transparent opacity-40`
                      : 'bg-gradient-to-t from-transparent to-gray-200/50'
                  }`}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-50%)`,
                    transformOrigin: 'center',
                  }}
                ></div>
              );
            })}
            
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
                  className="relative"
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive ? 40 : isHovered ? 35 : 30,
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {/* Efecto de halo para elemento activo */}
                  {isActive && (
                    <div className={`absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-br ${category.color} opacity-20 blur-xl animate-pulse`}></div>
                  )}
                  
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`relative w-16 h-16 transition-all duration-500 ease-out ${
                      isActive 
                        ? `bg-gradient-to-br ${category.color} text-white shadow-2xl scale-125 ring-4 ring-white` 
                        : "bg-white text-gray-700 hover:bg-gradient-to-br hover:" + category.color + " hover:text-white shadow-lg"
                    } rounded-full flex items-center justify-center border-3 ${
                      isActive ? "border-white" : "border-gray-100"
                    } ${isHovered && !isActive ? "shadow-2xl scale-110 ring-2 ring-gray-300" : ""}`}
                    title={category.name}
                  >
                    <span className={`text-2xl transition-all duration-300 ${
                      isHovered || isActive ? 'scale-110' : ''
                    }`}>
                      {category.icon}
                    </span>
                    
                    {/* Efecto de pulso para el activo */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" 
                           style={{ animationDuration: '2s' }}></div>
                    )}
                  </button>
                  
                  {/* Etiqueta de categoría */}
                  {showLabels && (
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                      isActive || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg ${
                        isActive 
                          ? `bg-gradient-to-r ${category.color} text-white` 
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}>
                        {category.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Centro mejorado con información dinámica */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br ${activeColor} rounded-full flex items-center justify-center border-4 border-white shadow-2xl z-50 transition-all duration-500`}>
              <div className="text-center text-white">
                <div className="text-3xl mb-1">{categories[activeIndex]?.icon}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                  Menu
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