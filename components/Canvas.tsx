import React, { useState } from "react";
import { ComponentConfig, ComponentDefinition } from "@/types";
import { ComponentRenderer } from "./ComponentRenderer";

interface CanvasProps {
  components: ComponentConfig[];
  onComponentsChange: (components: ComponentConfig[]) => void;
  onComponentSelect: (componentId: string) => void;
  selectedComponentId?: string;
  onReorderComponents: (startIndex: number, endIndex: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteComponent: (componentId: string) => void;
  onDuplicateComponent: (componentId: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponentId,
  onReorderComponents,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDeleteComponent,
  onDuplicateComponent,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      ) as ComponentDefinition;

      const newComponent: ComponentConfig = {
        id: `component-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: componentData.type,
        props: { ...componentData.defaultProps },
        children: [],
      };

      onComponentsChange([...components, newComponent]);
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
  };

  const handleCanvasClick = () => {
    onComponentSelect("");
  };

  // Drag & Drop reorder functionality
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverComponent = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropComponent = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderComponents(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="flex-1 bg-gray-100 h-screen overflow-auto">
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* Canvas Header */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Low-Code Builder
                </h1>
                <p className="text-gray-600">
                  Drag components from the sidebar to build your page
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    canUndo
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  ↩ Undo
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    canRedo
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title="Redo (Ctrl+Y)"
                >
                  ↪ Redo
                </button>
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    isPreviewMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isPreviewMode ? "✏️ Edit" : "👀 Preview"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div
            className={`min-h-[600px] bg-white rounded-lg shadow-sm p-8 transition-all ${
              isDragOver
                ? "border-2 border-blue-400 bg-blue-50"
                : "border-2 border-dashed border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleCanvasClick}
          >
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-medium mb-2">Empty Canvas</h3>
                <p className="text-center max-w-md">
                  Start building by dragging components from the sidebar to this
                  area. You can arrange, resize, and customize them to create
                  your perfect layout.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {components.map((component, index) => (
                  <div
                    key={component.id}
                    draggable={!isPreviewMode}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOverComponent(e, index)}
                    onDrop={(e) => handleDropComponent(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative ${
                      draggedIndex === index ? "opacity-50" : ""
                    } ${!isPreviewMode ? "cursor-move" : ""}`}
                  >
                    <ComponentRenderer
                      component={component}
                      onSelect={onComponentSelect}
                      selectedId={selectedComponentId}
                      isPreviewMode={isPreviewMode}
                    />
                    {!isPreviewMode && (
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComponentSelect(component.id);
                          }}
                          className="p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateComponent(component.id);
                          }}
                          className="p-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          title="Duplicate (Ctrl+D)"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteComponent(component.id);
                          }}
                          className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          title="Delete (Del)"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Canvas Footer */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {components.length} component
                {components.length !== 1 ? "s" : ""} on canvas
                {isPreviewMode && (
                  <span className="ml-2 text-blue-600">• Preview Mode</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    canUndo
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Undo
                </button>
                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    canRedo
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Redo
                </button>
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    isPreviewMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isPreviewMode ? "Edit" : "Preview"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
