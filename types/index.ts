export interface ComponentConfig {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentConfig[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: string;
  defaultProps: Record<string, any>;
  properties: PropertyDefinition[];
}

export interface PropertyDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "color" | "textarea";
  label: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
}

export interface ProjectData {
  id: string;
  name: string;
  components: ComponentConfig[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface CodeGenerationOptions {
  framework: "nextjs" | "react";
  styling: "tailwind" | "styled-components" | "css";
  typescript: boolean;
  exportPath: string;
}
