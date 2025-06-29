import React from "react";
import { ComponentConfig } from "@/types";
import { Container } from "./rendered/Container";
import { Heading } from "./rendered/Heading";
import { Paragraph } from "./rendered/Paragraph";
import { Button } from "./rendered/Button";
import Label from "./rendered/Label";
import Select from "./rendered/Select";

interface ComponentRendererProps {
  component: ComponentConfig;
  onSelect?: (componentId: string) => void;
  selectedId?: string;
  isPreviewMode?: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  onSelect,
  selectedId,
  isPreviewMode = false,
}) => {
  const isSelected = selectedId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return; // Disable selection in preview mode
    e.stopPropagation();
    onSelect?.(component.id);
  };

  const renderComponent = () => {
    switch (component.type) {
      case "container":
        return (
          <Container {...component.props}>
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                onSelect={onSelect}
                selectedId={selectedId}
                isPreviewMode={isPreviewMode}
              />
            ))}
          </Container>
        );

      case "heading":
        return (
          <Heading
            text={component.props.text || "Heading Text"}
            level={component.props.level || "h1"}
            className={component.props.className}
          />
        );

      case "paragraph":
        return (
          <Paragraph
            text={component.props.text || "This is a paragraph of text."}
            className={component.props.className}
          />
        );

      case "button":
        return (
          <Button
            text={component.props.text || "Click me"}
            variant={component.props.variant}
            size={component.props.size}
            className={component.props.className}
          />
        );

      case "image":
        return (
          <img
            src={component.props.src || "https://via.placeholder.com/400x300"}
            alt={component.props.alt || "Image"}
            className={component.props.className}
          />
        );

      case "card":
        return (
          <div className={component.props.className}>
            <h3 className="text-lg font-semibold mb-2">
              {component.props.title || "Card Title"}
            </h3>
            <p>{component.props.content || "Card content goes here"}</p>
          </div>
        );

      case "form":
        return (
          <form
            action={component.props.action}
            method={component.props.method}
            className={component.props.className}
          >
            {component.children?.map((child) => (
              <ComponentRenderer
                key={child.id}
                component={child}
                onSelect={onSelect}
                selectedId={selectedId}
                isPreviewMode={isPreviewMode}
              />
            ))}
          </form>
        );

      case "input":
        return (
          <input
            type={component.props.type || "text"}
            placeholder={component.props.placeholder}
            name={component.props.name}
            className={component.props.className}
          />
        );

      case "label":
        return (
          <Label
            key={component.id}
            text={component.props.text || "Label"}
            htmlFor={component.props.htmlFor}
            className={component.props.className}
          />
        );

      case "select":
        let options = [];
        try {
          options =
            typeof component.props.options === "string"
              ? JSON.parse(component.props.options)
              : component.props.options || [];
        } catch {
          options = [];
        }
        return (
          <Select
            key={component.id}
            options={options}
            value={component.props.value}
            onChange={() => {}}
            className={component.props.className}
            name={component.props.name}
            id={component.props.id}
            label={component.props.label}
          />
        );

      default:
        return <div>Unknown component: {component.type}</div>;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative ${
        isSelected && !isPreviewMode ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
    >
      {renderComponent()}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
          {component.type}
        </div>
      )}
    </div>
  );
};
