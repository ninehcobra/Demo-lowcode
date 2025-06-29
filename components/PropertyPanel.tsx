import React from "react";
import { ComponentConfig, PropertyDefinition } from "@/types";
import { getComponentDefinition } from "@/lib/componentLibrary";

interface PropertyPanelProps {
  selectedComponent: ComponentConfig | null;
  onPropertyChange: (
    componentId: string,
    propertyName: string,
    value: any
  ) => void;
  onDeleteComponent: (componentId: string) => void;
  onDuplicateComponent: (componentId: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropertyChange,
  onDeleteComponent,
  onDuplicateComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-80 lg:w-96 xl:w-[420px] bg-gray-50 border-l border-gray-200 h-screen p-3 sm:p-4 flex flex-col">
        <div className="text-center text-gray-500 flex-1 flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚙️</div>
          <h3 className="text-base sm:text-lg font-medium mb-2 leading-tight">
            Properties
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Select a component to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const componentDefinition = getComponentDefinition(selectedComponent.type);

  if (!componentDefinition) {
    return (
      <div className="w-80 lg:w-96 xl:w-[420px] bg-gray-50 border-l border-gray-200 h-screen p-3 sm:p-4 flex flex-col">
        <div className="text-center text-gray-500 flex-1 flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm leading-relaxed">
            Unknown component type: {selectedComponent.type}
          </p>
        </div>
      </div>
    );
  }

  const renderPropertyInput = (property: PropertyDefinition) => {
    const value =
      selectedComponent.props[property.name] ?? property.defaultValue;

    switch (property.type) {
      case "string":
      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={property.type === "textarea" ? 3 : 1}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                Number(e.target.value)
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                e.target.checked
              )
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "color":
        return (
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                e.target.value
              )
            }
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              onPropertyChange(
                selectedComponent.id,
                property.name,
                e.target.value
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      onDeleteComponent(selectedComponent.id);
    }
  };

  const handleDuplicate = () => {
    onDuplicateComponent(selectedComponent.id);
  };

  return (
    <div className="w-80 lg:w-96 xl:w-[420px] bg-gray-50 border-l border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">
          Properties
        </h2>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          {componentDefinition.name} ({selectedComponent.type})
        </p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {componentDefinition.properties.map((property) => (
          <div key={property.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2 leading-tight">
              {property.label}
            </label>
            {renderPropertyInput(property)}
          </div>
        ))}

        {/* Component Actions */}
        <div className="pt-4 border-t border-gray-200 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3 leading-tight">
            Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
            >
              🗑️ Delete Component
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors font-medium"
            >
              📋 Duplicate Component
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Keyboard Shortcuts
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div>Ctrl+Z - Undo</div>
            <div>Ctrl+Y - Redo</div>
            <div>Delete - Delete component</div>
            <div>Ctrl+D - Duplicate component</div>
          </div>
        </div>
      </div>
    </div>
  );
};
