"use server"

import {
  CODER_EMBEDDING_DIMENSIONS,
  CODER_EMBEDDING_MODEL
} from "@/lib/constants/coder-config"
import OpenAI from "openai"

const openai = new OpenAI()

export async function generateEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: CODER_EMBEDDING_MODEL,
      dimensions: CODER_EMBEDDING_DIMENSIONS,
      input: text
    })

    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw error
  }
}
