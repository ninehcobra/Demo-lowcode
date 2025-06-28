"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ComponentConfig } from "@/types";
import { Sidebar } from "@/components/Sidebar";
import { Canvas } from "@/components/Canvas";
import { PropertyPanel } from "@/components/PropertyPanel";
import { AIAssistantSettings } from "@/components/CodySettings";
import { AIAssistant } from "@/components/CodyAssistant";
import { AIAssistantConfig } from "@/lib/aiAssistantIntegration";

export default function Home() {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIAssistantSettings, setShowAIAssistantSettings] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiConfig, setAIConfig] = useState<AIAssistantConfig | null>(null);

  // Undo/Redo functionality
  const [history, setHistory] = useState<ComponentConfig[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedComponent =
    components.find((comp) => comp.id === selectedComponentId) || null;

  // Load AI config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("aiConfig");
    if (savedConfig) {
      try {
        setAIConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Error loading AI config:", error);
      }
    }
  }, []);

  // Save current state to history
  const saveToHistory = useCallback(
    (newComponents: ComponentConfig[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Update components and save to history
  const updateComponents = useCallback(
    (newComponents: ComponentConfig[]) => {
      setComponents(newComponents);
      saveToHistory(newComponents);
    },
    [saveToHistory]
  );

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  const handlePropertyChange = (
    componentId: string,
    propertyName: string,
    value: any
  ) => {
    const newComponents = components.map((comp) =>
      comp.id === componentId
        ? { ...comp, props: { ...comp.props, [propertyName]: value } }
        : comp
    );
    updateComponents(newComponents);
  };

  // Undo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
    }
  };

  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    updateComponents([]);
    setSelectedComponentId("");
  };

  // Delete component
  const handleDeleteComponent = (componentId: string) => {
    const newComponents = components.filter((comp) => comp.id !== componentId);
    updateComponents(newComponents);
    setSelectedComponentId("");
  };

  // Duplicate component
  const handleDuplicateComponent = (componentId: string) => {
    const componentToDuplicate = components.find(
      (comp) => comp.id === componentId
    );
    if (componentToDuplicate) {
      const duplicatedComponent: ComponentConfig = {
        ...componentToDuplicate,
        id: `component-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        children: componentToDuplicate.children
          ? componentToDuplicate.children.map((child) => ({
              ...child,
              id: `component-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            }))
          : undefined,
      };

      const componentIndex = components.findIndex(
        (comp) => comp.id === componentId
      );
      const newComponents = [...components];
      newComponents.splice(componentIndex + 1, 0, duplicatedComponent);
      updateComponents(newComponents);
    }
  };

  // Reorder components (drag & drop)
  const handleReorderComponents = (startIndex: number, endIndex: number) => {
    const newComponents = [...components];
    const [removed] = newComponents.splice(startIndex, 1);
    newComponents.splice(endIndex, 0, removed);
    updateComponents(newComponents);
  };

  // Export functionality
  const handleExport = () => {
    setShowExportModal(true);
  };

  // AI Assistant functions
  const handleAIConfigSave = (config: AIAssistantConfig) => {
    setAIConfig(config);
    localStorage.setItem("aiConfig", JSON.stringify(config));
  };

  const handleAIGenerateComponents = (
    generatedComponents: ComponentConfig[]
  ) => {
    updateComponents([...components, ...generatedComponents]);
  };

  const generateCode = async (options: any) => {
    try {
      // Import dynamically to avoid SSR issues
      const { CodeGenerator } = await import("@/lib/codeGenerator");
      const codeGenerator = new CodeGenerator();
      const code = await codeGenerator.generateNextJS(components, options);

      // Create and download the file
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-page.tsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowExportModal(false);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case "y":
            e.preventDefault();
            handleRedo();
            break;
          case "Delete":
          case "Backspace":
            e.preventDefault();
            if (selectedComponentId) {
              handleDeleteComponent(selectedComponentId);
            }
            break;
          case "d":
            e.preventDefault();
            if (selectedComponentId) {
              handleDuplicateComponent(selectedComponentId);
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponentId, historyIndex, history.length]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        onComponentSelect={() => {}}
        onClearCanvas={handleClearCanvas}
        onExport={handleExport}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenAIAssistantSettings={() => setShowAIAssistantSettings(true)}
        isAIAssistantConfigured={!!aiConfig}
      />

      {/* Main Canvas */}
      <Canvas
        components={components}
        onComponentsChange={updateComponents}
        onComponentSelect={handleComponentSelect}
        selectedComponentId={selectedComponentId}
        onReorderComponents={handleReorderComponents}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onDeleteComponent={handleDeleteComponent}
        onDuplicateComponent={handleDuplicateComponent}
      />

      {/* Property Panel */}
      <PropertyPanel
        selectedComponent={selectedComponent}
        onPropertyChange={handlePropertyChange}
        onDeleteComponent={handleDeleteComponent}
        onDuplicateComponent={handleDuplicateComponent}
      />

      {/* AI Assistant Settings Modal */}
      {showAIAssistantSettings && (
        <AIAssistantSettings
          onConfigSave={handleAIConfigSave}
          onClose={() => setShowAIAssistantSettings(false)}
          initialConfig={aiConfig || undefined}
        />
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          aiConfig={aiConfig}
          onGenerateComponents={handleAIGenerateComponents}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Export Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Framework
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Styling
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="tailwind">Tailwind CSS</option>
                  <option value="styled-components">Styled Components</option>
                  <option value="css">CSS Modules</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="typescript"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="typescript" className="text-sm">
                  TypeScript
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  generateCode({
                    framework: "nextjs",
                    styling: "tailwind",
                    typescript: true,
                  })
                }
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Generate Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
