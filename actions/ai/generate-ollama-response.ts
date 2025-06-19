"use server"

import { calculateLLMCost } from "@/lib/ai/calculate-llm-cost"

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "codellama:instruct"

type ChatCompletionMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export const generateOllamaResponse = async (
  messages: ChatCompletionMessage[]
) => {
  try {
    const requestBody = {
      model: OLLAMA_MODEL,
      messages,
      stream: false
    }

    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `Ollama API request failed with status ${response.status}: ${errorBody}`
      )
    }

    const data = await response.json()

    calculateLLMCost({ llmId: "ollama", inputTokens: 0, outputTokens: 0 })

    return data.message?.content || ""
  } catch (error) {
    console.error("Error generating AI response with Ollama:", error)
    throw error
  }
}
