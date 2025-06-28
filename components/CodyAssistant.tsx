import React, { useState } from "react";
import {
  AIAssistantIntegration,
  AIAssistantConfig,
} from "@/lib/aiAssistantIntegration";
import { ComponentConfig } from "@/types";

interface AIAssistantProps {
  aiConfig: AIAssistantConfig | null;
  onGenerateComponents: (components: ComponentConfig[]) => void;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  aiConfig,
  onGenerateComponents,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customDescription, setCustomDescription] = useState("");
  const [generationResult, setGenerationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const templates = [
    {
      id: "contact-form",
      name: "Contact Form",
      description:
        "Generate a contact form with name, email, and message fields",
      prompt:
        "Create a contact form with name, email, phone, and message fields. Include proper validation and styling.",
    },
    {
      id: "landing-page",
      name: "Landing Page",
      description: "Generate a landing page with hero section and features",
      prompt:
        "Create a modern landing page with hero section, features, testimonials, and call-to-action buttons.",
    },
    {
      id: "ecommerce",
      name: "E-commerce Page",
      description: "Generate an e-commerce page with product grid and cart",
      prompt:
        "Create an e-commerce page with product grid, product cards, add to cart buttons, and shopping cart.",
    },
    {
      id: "blog-post",
      name: "Blog Post",
      description:
        "Generate a blog post layout with title, content, and author",
      prompt:
        "Create a blog post layout with title, author info, publication date, content, and social sharing buttons.",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Generate a dashboard with cards, charts, and navigation",
      prompt:
        "Create a dashboard with navigation sidebar, stats cards, charts, and data tables.",
    },
    {
      id: "custom",
      name: "Custom",
      description: "Describe what you want to create",
      prompt: "",
    },
  ];

  const handleGenerate = async () => {
    if (!aiConfig) {
      setGenerationResult({
        success: false,
        message: "Please configure AI Assistant first",
      });
      return;
    }

    if (!prompt.trim() && selectedTemplate !== "custom") {
      setGenerationResult({
        success: false,
        message: "Please enter a prompt or select a template",
      });
      return;
    }

    if (selectedTemplate === "custom" && !customDescription.trim()) {
      setGenerationResult({
        success: false,
        message: "Please describe what you want to create",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const ai = new AIAssistantIntegration(aiConfig);
      let finalPrompt = prompt;

      if (selectedTemplate !== "custom") {
        const template = templates.find((t) => t.id === selectedTemplate);
        finalPrompt = template?.prompt || prompt;
      } else {
        finalPrompt = customDescription;
      }

      const result = await ai.generateComponentsFromPrompt(finalPrompt);

      if (result.success && result.data) {
        onGenerateComponents(result.data);
        setGenerationResult({
          success: true,
          message: `Successfully generated ${result.data.length} components!`,
        });
        setTimeout(() => onClose(), 2000);
      } else {
        setGenerationResult({
          success: false,
          message: `Generation failed: ${result.error}`,
        });
      }
    } catch (error) {
      setGenerationResult({
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== "custom") {
      const template = templates.find((t) => t.id === templateId);
      setPrompt(template?.prompt || "");
    } else {
      setPrompt("");
    }
  };

  if (!aiConfig) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">
            AI Assistant Not Configured
          </h3>
          <p className="text-gray-600 mb-4">
            Please configure AI Assistant settings first to use this feature.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🤖 AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 text-left rounded-md border transition-colors ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Description */}
          {selectedTemplate === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you want to create
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe the page or form you want to create. Be as detailed as possible..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Prompt (Optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a custom prompt or modify the template prompt..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Generation Result */}
          {generationResult && (
            <div
              className={`p-3 rounded-md ${
                generationResult.success
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {generationResult.success ? "✅" : "❌"}
                </span>
                <span className="text-sm">{generationResult.message}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isGenerating ? "🤖 Generating..." : "🚀 Generate Components"}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
              💡 Tips for better results:
            </h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Be specific about the layout and components you want</li>
              <li>• Mention styling preferences (colors, spacing, etc.)</li>
              <li>
                • Include functionality requirements (forms, buttons, etc.)
              </li>
              <li>• Specify if you want responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
