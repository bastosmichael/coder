"use server"

import { getUserId } from "@/actions/auth/auth"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "../db"
import {
  InsertAppConfig,
  SelectAppConfig,
  appConfigTable
} from "../schema/app-config-schema"

export async function getAppConfigByUserId(): Promise<
  SelectAppConfig | undefined
> {
  const userId = await getUserId()

  try {
    return await db.query.appConfig.findFirst({
      where: eq(appConfigTable.userId, userId)
    })
  } catch (error) {
    console.error(error)
  }
}

export async function upsertAppConfig(
  data: Omit<InsertAppConfig, "userId">
): Promise<SelectAppConfig> {
  const userId = await getUserId()

  try {
    const existingConfig = await db.query.appConfig.findFirst({
      where: eq(appConfigTable.userId, userId)
    })

    if (existingConfig) {
      const [updatedConfig] = await db
        .update(appConfigTable)
        .set(data)
        .where(eq(appConfigTable.userId, userId))
        .returning()
      revalidatePath("/")
      return updatedConfig
    }

    const [createdConfig] = await db
      .insert(appConfigTable)
      .values({ ...data, userId })
      .returning()
    revalidatePath("/")
    return createdConfig
  } catch (error) {
    console.error("Error saving app config:", error)
    throw error
  }
}
