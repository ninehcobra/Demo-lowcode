import React, { useState } from "react";
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

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 flex-shrink-0 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {getComponentsByCategory(selectedCategory).map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => onComponentSelect(component)}
              className="flex flex-col items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">
                {component.icon}
              </div>
              <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                {component.name}
              </div>
            </div>
          ))}
        </div>
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
