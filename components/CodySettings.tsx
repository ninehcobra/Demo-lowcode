import React, { useState } from "react";
import { AIAssistantConfig } from "@/lib/aiAssistantIntegration";

interface AIAssistantSettingsProps {
  onConfigSave: (config: AIAssistantConfig) => void;
  onClose: () => void;
  initialConfig?: AIAssistantConfig;
}

export const AIAssistantSettings: React.FC<AIAssistantSettingsProps> = ({
  onConfigSave,
  onClose,
  initialConfig,
}) => {
  const [provider, setProvider] = useState<AIAssistantConfig["provider"]>(
    initialConfig?.provider || "cody"
  );
  const [accessToken, setAccessToken] = useState(
    initialConfig?.accessToken || ""
  );
  const [endpoint, setEndpoint] = useState(
    initialConfig?.endpoint ||
      (provider === "cody"
        ? "https://sourcegraph.com/.api/graphql"
        : "https://api.openai.com/v1/chat/completions")
  );
  const [model, setModel] = useState(
    initialConfig?.model ||
      (provider === "cody" ? "claude-3-sonnet" : "gpt-3.5-turbo")
  );

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSave = () => {
    if (!accessToken.trim()) {
      alert("Please enter your access token");
      return;
    }
    onConfigSave({ provider, accessToken, endpoint, model });
    onClose();
  };

  const handleTestConnection = async () => {
    if (!accessToken.trim()) {
      setTestResult({
        success: false,
        message: "Please enter your access token first",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const { AIAssistantIntegration } = await import(
        "@/lib/aiAssistantIntegration"
      );
      const ai = new AIAssistantIntegration({
        provider,
        accessToken,
        endpoint,
        model,
      });
      const result = await ai.testConnection();

      if (result.success) {
        setTestResult({
          success: true,
          message:
            provider === "cody"
              ? `Connection successful! Connected as: ${
                  result.data?.currentUser?.username || "Unknown user"
                }`
              : "Connection successful!",
        });
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${result.error}`,
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error testing connection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Update endpoint/model when provider changes
  React.useEffect(() => {
    setEndpoint(
      provider === "cody"
        ? "https://sourcegraph.com/.api/graphql"
        : "https://api.openai.com/v1/chat/completions"
    );
    setModel(provider === "cody" ? "claude-3-sonnet" : "gpt-3.5-turbo");
  }, [provider]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Assistant Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider *
            </label>
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as AIAssistantConfig["provider"])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cody">Cody (Sourcegraph)</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          {/* Access Token / API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {provider === "cody" ? "Access Token *" : "OpenAI API Key *"}
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder={
                provider === "cody"
                  ? "Enter your Cody access token"
                  : "Enter your OpenAI API key"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {provider === "cody" ? (
              <p className="text-xs text-gray-500 mt-1">
                Get your access token from{" "}
                <a
                  href="https://sourcegraph.com/user/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Sourcegraph settings
                </a>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  OpenAI API Keys
                </a>
              </p>
            )}
          </div>

          {/* Endpoint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint
            </label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder={
                provider === "cody"
                  ? "https://sourcegraph.com/.api/graphql"
                  : "https://api.openai.com/v1/chat/completions"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {provider === "cody" ? (
                <>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </>
              ) : (
                <>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o">GPT-4o</option>
                </>
              )}
            </select>
          </div>

          {/* Test Connection */}
          <div>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-md ${
                testResult.success
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{testResult.success ? "✅" : "❌"}</span>
                <span className="text-sm">{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              How to get your access token/API key:
            </h4>
            <ol className="text-xs text-gray-600 space-y-1">
              {provider === "cody" ? (
                <>
                  <li>
                    1. Go to{" "}
                    <a
                      href="https://sourcegraph.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Sourcegraph.com
                    </a>
                  </li>
                  <li>2. Sign in to your account</li>
                  <li>3. Go to Settings → Access Tokens</li>
                  <li>4. Create a new token with Cody permissions</li>
                  <li>5. Copy the token and paste it above</li>
                </>
              ) : (
                <>
                  <li>
                    1. Go to{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      OpenAI API Keys
                    </a>
                  </li>
                  <li>2. Sign in to your account</li>
                  <li>3. Create a new secret key</li>
                  <li>4. Copy the key and paste it above</li>
                </>
              )}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
