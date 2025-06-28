import { ComponentDefinition } from "@/types";

export const componentLibrary: ComponentDefinition[] = [
  {
    type: "container",
    name: "Container",
    icon: "📦",
    category: "Layout",
    defaultProps: {
      className: "p-4 bg-white rounded-lg shadow",
      children: [],
    },
    properties: [
      {
        name: "className",
        type: "string",
        label: "CSS Classes",
        defaultValue: "p-4 bg-white rounded-lg shadow",
      },
      {
        name: "padding",
        type: "select",
        label: "Padding",
        defaultValue: "p-4",
        options: [
          { label: "None", value: "p-0" },
          { label: "Small", value: "p-2" },
          { label: "Medium", value: "p-4" },
          { label: "Large", value: "p-6" },
          { label: "Extra Large", value: "p-8" },
        ],
      },
    ],
  },
  {
    type: "heading",
    name: "Heading",
    icon: "📝",
    category: "Typography",
    defaultProps: {
      text: "Heading Text",
      level: "h1",
      className: "text-2xl font-bold text-gray-900",
    },
    properties: [
      {
        name: "text",
        type: "string",
        label: "Text Content",
        defaultValue: "Heading Text",
      },
      {
        name: "level",
        type: "select",
        label: "Heading Level",
        defaultValue: "h1",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" },
        ],
      },
      {
        name: "className",
        type: "string",
        label: "CSS Classes",
        defaultValue: "text-2xl font-bold text-gray-900",
      },
    ],
  },
  {
    type: "paragraph",
    name: "Paragraph",
    icon: "📄",
    category: "Typography",
    defaultProps: {
      text: "This is a paragraph of text. You can edit this content.",
      className: "text-gray-700 leading-relaxed",
    },
    properties: [
      {
        name: "text",
        type: "textarea",
        label: "Text Content",
        defaultValue: "This is a paragraph of text. You can edit this content.",
      },
      {
        name: "className",
        type: "string",
        label: "CSS Classes",
        defaultValue: "text-gray-700 leading-relaxed",
      },
    ],
  },
  {
    type: "button",
    name: "Button",
    icon: "🔘",
    category: "Interactive",
    defaultProps: {
      text: "Click me",
      variant: "primary",
      size: "medium",
      className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
    },
    properties: [
      {
        name: "text",
        type: "string",
        label: "Button Text",
        defaultValue: "Click me",
      },
      {
        name: "variant",
        type: "select",
        label: "Variant",
        defaultValue: "primary",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Outline", value: "outline" },
          { label: "Ghost", value: "ghost" },
        ],
      },
      {
        name: "size",
        type: "select",
        label: "Size",
        defaultValue: "medium",
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
        ],
      },
    ],
  },
  {
    type: "image",
    name: "Image",
    icon: "🖼️",
    category: "Media",
    defaultProps: {
      src: "https://via.placeholder.com/400x300",
      alt: "Placeholder image",
      className: "rounded-lg shadow-md",
    },
    properties: [
      {
        name: "src",
        type: "string",
        label: "Image URL",
        defaultValue: "https://via.placeholder.com/400x300",
      },
      {
        name: "alt",
        type: "string",
        label: "Alt Text",
        defaultValue: "Placeholder image",
      },
      {
        name: "className",
        type: "string",
        label: "CSS Classes",
        defaultValue: "rounded-lg shadow-md",
      },
    ],
  },
  {
    type: "card",
    name: "Card",
    icon: "🃏",
    category: "Layout",
    defaultProps: {
      title: "Card Title",
      content: "Card content goes here",
      className: "bg-white rounded-lg shadow-md p-6",
    },
    properties: [
      {
        name: "title",
        type: "string",
        label: "Card Title",
        defaultValue: "Card Title",
      },
      {
        name: "content",
        type: "textarea",
        label: "Card Content",
        defaultValue: "Card content goes here",
      },
      {
        name: "className",
        type: "string",
        label: "CSS Classes",
        defaultValue: "bg-white rounded-lg shadow-md p-6",
      },
    ],
  },
  {
    type: "form",
    name: "Form",
    icon: "📋",
    category: "Interactive",
    defaultProps: {
      action: "/submit",
      method: "POST",
      className: "space-y-4",
    },
    properties: [
      {
        name: "action",
        type: "string",
        label: "Form Action",
        defaultValue: "/submit",
      },
      {
        name: "method",
        type: "select",
        label: "Method",
        defaultValue: "POST",
        options: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" },
        ],
      },
    ],
  },
  {
    type: "input",
    name: "Input",
    icon: "📝",
    category: "Interactive",
    defaultProps: {
      type: "text",
      placeholder: "Enter text...",
      name: "input",
      className:
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    },
    properties: [
      {
        name: "type",
        type: "select",
        label: "Input Type",
        defaultValue: "text",
        options: [
          { label: "Text", value: "text" },
          { label: "Email", value: "email" },
          { label: "Password", value: "password" },
          { label: "Number", value: "number" },
          { label: "Tel", value: "tel" },
          { label: "URL", value: "url" },
        ],
      },
      {
        name: "placeholder",
        type: "string",
        label: "Placeholder",
        defaultValue: "Enter text...",
      },
      {
        name: "name",
        type: "string",
        label: "Field Name",
        defaultValue: "input",
      },
    ],
  },
  {
    type: "label",
    name: "Label",
    icon: "🏷️",
    category: "Form",
    defaultProps: {
      text: "Label",
      htmlFor: "",
      className: "",
    },
    properties: [
      { name: "text", type: "string", label: "Text" },
      { name: "htmlFor", type: "string", label: "For (htmlFor)" },
      { name: "className", type: "string", label: "Class Name" },
    ],
  },
  {
    type: "select",
    name: "Select",
    icon: "🔽",
    category: "Form",
    defaultProps: {
      value: "",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
      className: "",
      name: "",
      id: "",
      label: "",
    },
    properties: [
      { name: "label", type: "string", label: "Label" },
      { name: "name", type: "string", label: "Name" },
      { name: "id", type: "string", label: "ID" },
      { name: "value", type: "string", label: "Value" },
      { name: "className", type: "string", label: "Class Name" },
      {
        name: "options",
        type: "string",
        label: "Options (JSON array: [{label, value}])",
      },
    ],
  },
];

export const getComponentDefinition = (
  type: string
): ComponentDefinition | undefined => {
  return componentLibrary.find((comp) => comp.type === type);
};

export const getComponentsByCategory = (
  category: string
): ComponentDefinition[] => {
  return componentLibrary.filter((comp) => comp.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(componentLibrary.map((comp) => comp.category)));
};
