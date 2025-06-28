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
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Components</h2>
        <p className="text-sm text-gray-600 mt-1">Drag components to canvas</p>
      </div>

      {/* AI Assistant Section */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          🤖 AI Assistant
        </h3>
        <div className="space-y-2">
          {isAIAssistantConfigured ? (
            <button
              onClick={onOpenAIAssistant}
              className="w-full px-3 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              🚀 Generate with AI
            </button>
          ) : (
            <button
              onClick={onOpenAIAssistantSettings}
              className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ⚙️ Configure AI Assistant
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
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
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {getComponentsByCategory(selectedCategory).map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => onComponentSelect(component)}
              className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
            >
              <div className="text-2xl mb-2">{component.icon}</div>
              <div className="text-xs font-medium text-gray-700 text-center">
                {component.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleClearCanvas}
            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            🗑️ Clear Canvas
          </button>
          <button
            onClick={onExport}
            className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            📤 Export Code
          </button>
          <button
            onClick={onOpenAIAssistantSettings}
            className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            ⚙️ AI Assistant Settings
          </button>
        </div>
      </div>
    </div>
  );
};
