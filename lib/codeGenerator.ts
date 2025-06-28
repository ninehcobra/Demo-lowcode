import { ComponentConfig, CodeGenerationOptions } from "@/types";

export class CodeGenerator {
  async generateNextJS(
    components: ComponentConfig[],
    options: CodeGenerationOptions
  ): Promise<string> {
    const { styling = "tailwind", typescript = true } = options;

    let code = "";

    if (typescript) {
      code += this.generateTypeScriptImports(styling);
    } else {
      code += this.generateJavaScriptImports(styling);
    }

    code += "\n";
    code += this.generateComponentCode(components, styling, typescript);

    return code;
  }

  private generateTypeScriptImports(styling: string): string {
    let imports = "import React from 'react';\n";

    if (styling === "styled-components") {
      imports += "import styled from 'styled-components';\n";
    }

    imports += "import { ComponentConfig } from './types';\n\n";

    return imports;
  }

  private generateJavaScriptImports(styling: string): string {
    let imports = "import React from 'react';\n";

    if (styling === "styled-components") {
      imports += "import styled from 'styled-components';\n";
    }

    imports += "\n";

    return imports;
  }

  private generateComponentCode(
    components: ComponentConfig[],
    styling: string,
    typescript: boolean
  ): string {
    const componentName = typescript
      ? "GeneratedPage: React.FC = () => {"
      : "const GeneratedPage = () => {";

    let code = `export ${componentName}\n`;
    code += "  return (\n";
    code += '    <div className="min-h-screen bg-gray-50">\n';
    code += '      <div className="max-w-4xl mx-auto py-8 px-4">\n';

    // Generate component JSX
    components.forEach((component) => {
      code += this.generateComponentJSX(component, styling);
    });

    code += "      </div>\n";
    code += "    </div>\n";
    code += "  );\n";
    code += "};\n\n";
    code += "export default GeneratedPage;\n";

    return code;
  }

  private generateComponentJSX(
    component: ComponentConfig,
    styling: string
  ): string {
    const indent = "        ";

    switch (component.type) {
      case "container":
        return this.generateContainerJSX(component, styling, indent);

      case "heading":
        return this.generateHeadingJSX(component, styling, indent);

      case "paragraph":
        return this.generateParagraphJSX(component, styling, indent);

      case "button":
        return this.generateButtonJSX(component, styling, indent);

      case "image":
        return this.generateImageJSX(component, styling, indent);

      case "card":
        return this.generateCardJSX(component, styling, indent);

      case "form":
        return this.generateFormJSX(component, styling, indent);

      case "input":
        return this.generateInputJSX(component, styling, indent);

      default:
        return `${indent}<!-- Unknown component: ${component.type} -->\n`;
    }
  }

  private generateContainerJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const className =
      component.props.className || "p-4 bg-white rounded-lg shadow";
    let code = `${indent}<div className="${className}">\n`;

    if (component.children && component.children.length > 0) {
      component.children.forEach((child) => {
        code += this.generateComponentJSX(child, styling);
      });
    }

    code += `${indent}</div>\n`;
    return code;
  }

  private generateHeadingJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { text, level, className } = component.props;
    const Tag = level || "h1";
    const classes = className || "text-2xl font-bold text-gray-900";

    return `${indent}<${Tag} className="${classes}">${
      text || "Heading"
    }</${Tag}>\n`;
  }

  private generateParagraphJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { text, className } = component.props;
    const classes = className || "text-gray-700 leading-relaxed";

    return `${indent}<p className="${classes}">${
      text || "Paragraph text"
    }</p>\n`;
  }

  private generateButtonJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { text, variant, size, className } = component.props;

    let classes = className;
    if (!classes) {
      classes =
        "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors";
    }

    return `${indent}<button className="${classes}">${
      text || "Button"
    }</button>\n`;
  }

  private generateImageJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { src, alt, className } = component.props;
    const classes = className || "rounded-lg shadow-md";

    return `${indent}<img src="${
      src || "https://via.placeholder.com/400x300"
    }" alt="${alt || "Image"}" className="${classes}" />\n`;
  }

  private generateCardJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { title, content, className } = component.props;
    const classes = className || "bg-white rounded-lg shadow-md p-6";

    let code = `${indent}<div className="${classes}">\n`;
    code += `${indent}  <h3 className="text-lg font-semibold mb-2">${
      title || "Card Title"
    }</h3>\n`;
    code += `${indent}  <p>${content || "Card content"}</p>\n`;
    code += `${indent}</div>\n`;

    return code;
  }

  private generateFormJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { action, method, className } = component.props;
    const classes = className || "space-y-4";

    let code = `${indent}<form action="${action || "/submit"}" method="${
      method || "POST"
    }" className="${classes}">\n`;

    if (component.children && component.children.length > 0) {
      component.children.forEach((child) => {
        code += this.generateComponentJSX(child, styling);
      });
    }

    code += `${indent}</form>\n`;
    return code;
  }

  private generateInputJSX(
    component: ComponentConfig,
    styling: string,
    indent: string
  ): string {
    const { type, placeholder, name, className } = component.props;
    const classes =
      className ||
      "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

    return `${indent}<input type="${type || "text"}" placeholder="${
      placeholder || "Enter text..."
    }" name="${name || "input"}" className="${classes}" />\n`;
  }

  // Generate complete Next.js page
  async generateNextJSPage(
    components: ComponentConfig[],
    options: CodeGenerationOptions
  ): Promise<string> {
    const pageCode = await this.generateNextJS(components, options);

    return `// Generated by Low-Code Builder
// This file was automatically generated from your design

${pageCode}`;
  }

  // Generate project structure
  async generateProjectStructure(
    components: ComponentConfig[],
    options: CodeGenerationOptions
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Main page component
    files["pages/index.tsx"] = await this.generateNextJSPage(
      components,
      options
    );

    // Package.json
    files["package.json"] = this.generatePackageJson(options);

    // Tailwind config if using Tailwind
    if (options.styling === "tailwind") {
      files["tailwind.config.js"] = this.generateTailwindConfig();
      files["styles/globals.css"] = this.generateGlobalCSS();
    }

    // TypeScript config
    if (options.typescript) {
      files["tsconfig.json"] = this.generateTSConfig();
    }

    return files;
  }

  private generatePackageJson(options: CodeGenerationOptions): string {
    const dependencies: any = {
      next: "^14.0.0",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    };

    if (options.styling === "tailwind") {
      dependencies.tailwindcss = "^3.3.0";
      dependencies.autoprefixer = "^10.4.16";
      dependencies.postcss = "^8.4.31";
    }

    if (options.styling === "styled-components") {
      dependencies["styled-components"] = "^6.1.0";
    }

    const devDependencies: any = {
      eslint: "^8.51.0",
      "eslint-config-next": "^14.0.0",
    };

    if (options.typescript) {
      devDependencies["@types/node"] = "^20.8.0";
      devDependencies["@types/react"] = "^18.2.0";
      devDependencies["@types/react-dom"] = "^18.2.0";
      devDependencies.typescript = "^5.2.0";
    }

    return JSON.stringify(
      {
        name: "generated-nextjs-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies,
        devDependencies,
      },
      null,
      2
    );
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  }

  private generateGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  }

  private generateTSConfig(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          target: "es5",
          lib: ["dom", "dom.iterable", "es6"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [
            {
              name: "next",
            },
          ],
          paths: {
            "@/*": ["./*"],
          },
        },
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      },
      null,
      2
    );
  }
}
