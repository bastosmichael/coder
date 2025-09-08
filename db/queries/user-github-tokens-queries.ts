"use server"

import { eq } from "drizzle-orm"
import { db } from "@/db/db"
import { 
  userGithubTokensTable, 
  type InsertUserGithubToken, 
  type SelectUserGithubToken 
} from "../schema/user-github-tokens-schema"

export async function createUserGithubToken(
  data: InsertUserGithubToken
): Promise<SelectUserGithubToken> {
  const [token] = await db
    .insert(userGithubTokensTable)
    .values(data)
    .returning()
  
  return token
}

export async function getUserGithubToken(
  userId: string
): Promise<SelectUserGithubToken | null> {
  const [token] = await db
    .select()
    .from(userGithubTokensTable)
    .where(eq(userGithubTokensTable.userId, userId))
    .limit(1)
  
  return token || null
}

export async function updateUserGithubToken(
  userId: string,
  data: Partial<InsertUserGithubToken>
): Promise<SelectUserGithubToken> {
  const [token] = await db
    .update(userGithubTokensTable)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(userGithubTokensTable.userId, userId))
    .returning()
  
  return token
}

export async function deleteUserGithubToken(userId: string): Promise<void> {
  await db
    .delete(userGithubTokensTable)
    .where(eq(userGithubTokensTable.userId, userId))
}

export async function upsertUserGithubToken(
  data: InsertUserGithubToken
): Promise<SelectUserGithubToken> {
  const existing = await getUserGithubToken(data.userId)
  
  if (existing) {
    return await updateUserGithubToken(data.userId, data)
  } else {
    return await createUserGithubToken(data)
  }
}