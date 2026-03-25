import type { OllamaMessage } from "./types";

const OLLAMA_URL = "http://localhost:11434";
const MODEL = "dolphin-llama3.1:8b-v2.9.4-Q4_K_S";

export async function checkConnection(): Promise<void> {
  const response = await fetch(`${OLLAMA_URL}/api/tags`);
  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const data = await response.json();
  const models: { name: string }[] = data.models ?? [];
  const found = models.some((m) => m.name === MODEL);
  if (!found) {
    throw new Error(
      `Model "${MODEL}" not found. Available: ${models.map((m) => m.name).join(", ") || "none"}`
    );
  }
}

export async function chat(messages: OllamaMessage[]): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, stream: false }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.message?.content) {
    throw new Error("Unexpected response shape from Ollama");
  }

  return data.message.content as string;
}
