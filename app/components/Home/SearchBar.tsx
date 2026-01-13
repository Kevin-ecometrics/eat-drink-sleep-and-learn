// app/components/Home/SearchBar.tsx - VERSIÓN MEJORADA
"use client";

import { useState, useRef } from "react";
import { HiSearch, HiX } from "react-icons/hi";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setIsTyping(true);

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Solo ejecutar búsqueda si hay texto o si estamos limpiando
    if (value.trim() === "") {
      // Si se limpia, ejecutar inmediatamente
      setIsTyping(false);
      onSearch("");
    } else {
      // Si hay texto, usar debounce
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onSearch(value);
      }, 300);
    }
  };

  const handleClear = () => {
    setKeyword("");
    setIsTyping(false);
    onSearch("");
    
    // Mantener el foco en el input después de limpiar
    inputRef.current?.focus();
    
    // Limpiar timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Limpiar timeout si se presiona Enter
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsTyping(false);
      }
      onSearch(keyword);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra de búsqueda */}
      <div className="relative group">
        {/* Icono de búsqueda */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <HiSearch 
            className={`text-xl transition-colors duration-200 ${
              isFocused ? 'text-blue-600' : 'text-slate-400'
            }`}
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar artículos, categorías..."
          className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 text-base bg-white shadow-sm
            ${isFocused 
              ? 'border-blue-500 ring-4 ring-blue-100' 
              : 'border-slate-200 hover:border-slate-300'
            }
            focus:outline-none placeholder:text-slate-400`}
        />

        {/* Botón de limpiar */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            aria-label="Limpiar búsqueda"
          >
            <HiX className="text-xl" />
          </button>
        )}

        {/* Barra de progreso de búsqueda */}
        {isTyping && keyword && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-100 rounded-b-xl overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" 
                 style={{ width: '60%' }} 
            />
          </div>
        )}
      </div>

      {/* Indicadores de estado */}
      <div className="mt-3 px-1">
        {isTyping && keyword ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
                    style={{ animationDelay: '0ms' }} 
              />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
                    style={{ animationDelay: '150ms' }} 
              />
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
                    style={{ animationDelay: '300ms' }} 
              />
            </div>
            <span className="font-medium">Buscando...</span>
          </div>
        ) : keyword ? (
          <p className="text-sm text-slate-600">
            Mostrando resultados para: 
            <span className="font-semibold text-slate-900 ml-1">{keyword}</span>
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Escribe para buscar en todos los artículos
          </p>
        )}
      </div>


    </div>
  );
}
