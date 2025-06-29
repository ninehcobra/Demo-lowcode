import React, { useState, useEffect } from "react";
import {
  componentLibrary,
  getAllCategories,
  getComponentsByCategory,
} from "@/lib/componentLibrary";
import { ComponentDefinition } from "@/types";

interface SidebarProps {
  onComponentSelect: (component: ComponentDefinition) => void;
  onClearCanvas: () => void;
  onExport: () => void;
  onOpenAIAssistant: () => void;
  onOpenAIAssistantSettings: () => void;
  isAIAssistantConfigured: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onComponentSelect,
  onClearCanvas,
  onExport,
  onOpenAIAssistant,
  onOpenAIAssistantSettings,
  isAIAssistantConfigured,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Layout");
  const categories = getAllCategories();
  const categoryTabsRef = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (
    e: React.DragEvent,
    component: ComponentDefinition
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
  };

  const handleClearCanvas = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the canvas? This action cannot be undone."
      )
    ) {
      onClearCanvas();
    }
  };

  const handleCategoryChange = (direction: "prev" | "next") => {
    const currentIndex = categories.indexOf(selectedCategory);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    } else {
      newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedCategory(categories[newIndex]);
  };

  // Auto-scroll to selected category tab
  useEffect(() => {
    if (categoryTabsRef.current) {
      const container = categoryTabsRef.current;
      const selectedTab = container.querySelector(
        `[data-category="${selectedCategory}"]`
      ) as HTMLElement;

      if (selectedTab) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = selectedTab.getBoundingClientRect();

        // Check if the selected tab is outside the visible area
        if (
          tabRect.left < containerRect.left ||
          tabRect.right > containerRect.right
        ) {
          selectedTab.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if sidebar is focused or when Alt key is pressed
      if (e.altKey) {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            handleCategoryChange("prev");
            break;
          case "ArrowRight":
            e.preventDefault();
            handleCategoryChange("next");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCategory, categories]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Layout":
        return "📦";
      case "Typography":
        return "📝";
      case "Interactive":
        return "🔘";
      case "Media":
        return "🖼️";
      case "Form":
        return "📋";
      default:
        return "📄";
    }
  };

  return (
    <div className="w-64 lg:w-72 xl:w-80 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
          Components
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
          Drag components to canvas
        </p>
      </div>

      {/* AI Assistant Section */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 leading-tight">
          🤖 AI Assistant
        </h3>
        <div className="space-y-2">
          {isAIAssistantConfigured ? (
            <button
              onClick={onOpenAIAssistant}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
            >
              <span className="hidden sm:inline">🚀 Generate with AI</span>
              <span className="sm:hidden">🚀 AI Generate</span>
            </button>
          ) : (
            <button
              onClick={onOpenAIAssistantSettings}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors font-medium"
            >
              <span className="hidden sm:inline">
                ⚙️ Configure AI Assistant
              </span>
              <span className="sm:hidden">⚙️ Configure AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
            Categories
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => handleCategoryChange("prev")}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Previous category"
            >
              ◀
            </button>
            <button
              onClick={() => handleCategoryChange("next")}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Next category"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Category Tabs with Icons */}
        <div
          ref={categoryTabsRef}
          className="flex border border-gray-200 rounded-lg overflow-x-auto scrollbar-hide shadow-sm"
        >
          {categories.map((category) => (
            <button
              key={category}
              data-category={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 category-tab ${
                selectedCategory === category
                  ? "text-blue-600 bg-blue-50 border-blue-200 shadow-sm active"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-transparent"
              }`}
              title={`Switch to ${category} category`}
            >
              <span className="text-sm transition-transform duration-200 hover:scale-110">
                {getCategoryIcon(category)}
              </span>
              <span className="hidden sm:inline">{category}</span>
              <span className="sm:hidden">{category.charAt(0)}</span>
            </button>
          ))}
        </div>

        {/* Current Category Display */}
        <div className="mt-2 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium shadow-sm">
            <span className="mr-1">{getCategoryIcon(selectedCategory)}</span>
            {selectedCategory}
            <span className="ml-1 text-blue-600">
              ({getComponentsByCategory(selectedCategory).length})
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Use Alt+←/→ or click arrows to navigate
          </div>
        </div>
      </div>

      {/* Component List */}
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {getComponentsByCategory(selectedCategory).length} components
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleCategoryChange("prev")}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs transition-colors"
              title="Previous category (Alt+←)"
            >
              ◀
            </button>
            <button
              onClick={() => handleCategoryChange("next")}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded text-xs transition-colors"
              title="Next category (Alt+→)"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {getComponentsByCategory(selectedCategory).map((component, index) => (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => onComponentSelect(component)}
              className="flex flex-col items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing transform hover:scale-105"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.3s ease-out forwards",
              }}
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2 transition-transform duration-200 hover:scale-110">
                {component.icon}
              </div>
              <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                {component.name}
              </div>
            </div>
          ))}
        </div>

        {getComponentsByCategory(selectedCategory).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-xs">No components in this category</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 leading-tight">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleClearCanvas}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
          >
            <span className="hidden sm:inline">🗑️ Clear Canvas</span>
            <span className="sm:hidden">🗑️ Clear</span>
          </button>
          <button
            onClick={onExport}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
          >
            <span className="hidden sm:inline">📤 Export Code</span>
            <span className="sm:hidden">📤 Export</span>
          </button>
          <button
            onClick={onOpenAIAssistantSettings}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors font-medium"
          >
            <span className="hidden sm:inline">⚙️ AI Assistant Settings</span>
            <span className="sm:hidden">⚙️ AI Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
