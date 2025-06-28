import { ComponentConfig } from "@/types";

export type AIProvider = "cody" | "openai";

export interface AIAssistantConfig {
  provider: AIProvider;
  accessToken: string;
  endpoint?: string;
  model?: string;
}

export interface AIAssistantResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIAssistantIntegration {
  private config: AIAssistantConfig;

  constructor(config: AIAssistantConfig) {
    this.config = config;
  }

  async testConnection(): Promise<AIAssistantResponse> {
    if (this.config.provider === "cody") {
      const endpoint =
        this.config.endpoint || "https://sourcegraph.com/.api/graphql";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `token ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query { currentUser { id username } }`,
          }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { success: true, data: data.data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else if (this.config.provider === "openai") {
      const endpoint =
        this.config.endpoint || "https://api.openai.com/v1/models";
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
    return { success: false, error: "Unknown provider" };
  }

  async generateComponentsFromPrompt(
    prompt: string
  ): Promise<AIAssistantResponse> {
    if (this.config.provider === "cody") {
      const endpoint =
        this.config.endpoint || "https://sourcegraph.com/.api/graphql";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `token ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation { codyChat(input: { message: "${this.escapePrompt(
              prompt
            )}" model: "${
              this.config.model || "claude-3-sonnet"
            }" context: "Generate React components for a low-code builder. Return only valid JSON array of ComponentConfig objects." }) { message { text } } }`,
          }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const components = this.parseAIResponse(
          data.data?.codyChat?.message?.text
        );
        return { success: true, data: components };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    } else if (this.config.provider === "openai") {
      const endpoint =
        this.config.endpoint || "https://api.openai.com/v1/chat/completions";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.config.model || "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are an expert React/Next.js UI generator for a low-code builder. You must only use the following component types (all lowercase) and their props (all lowercase):

- container: { className, children }
- heading: { text, level, className }
- paragraph: { text, className }
- button: { text, className }
- image: { src, alt, className }
- card: { title, content, className }
- form: { action, method, className, children }
- input: { type, placeholder, name, className }
- label: { text, htmlFor, className }
- select: { options (array of {label, value}), value, name, id, label, className }

The type field must be one of: container, heading, paragraph, button, image, card, form, input, label, select (all lowercase).
Return only a valid JSON array of ComponentConfig objects (with type, props, children if needed). Do not include any explanation or markdown.`,
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
          }),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Parse OpenAI response
        const text = data.choices?.[0]?.message?.content || "";
        const components = this.parseAIResponse(text);
        return { success: true, data: components };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
    return { success: false, error: "Unknown provider" };
  }

  private parseAIResponse(responseText: string): ComponentConfig[] {
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const components = JSON.parse(jsonMatch[0]);
        return this.validateAndFixComponents(components);
      }
      const components = JSON.parse(responseText);
      return this.validateAndFixComponents(components);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  }

  private validateAndFixComponents(components: any[]): ComponentConfig[] {
    return components.map((comp, index) => ({
      id: comp.id || `component-${Date.now()}-${index}`,
      type: comp.type || "container",
      props: comp.props || {},
      children: comp.children
        ? this.validateAndFixComponents(comp.children)
        : undefined,
    }));
  }

  private escapePrompt(prompt: string): string {
    return prompt.replace(/"/g, '\\"').replace(/\n/g, "\\n");
  }
}
