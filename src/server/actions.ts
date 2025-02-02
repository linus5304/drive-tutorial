"use server"
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { filesTable } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi()

export async function deleteFile(fileId: number) {
    const session = await auth()
    if (!session.userId) {
        throw new Error("Unauthorized")
    }
    const [file] = await db.select().from(filesTable).where(and(eq(filesTable.id, fileId), eq(filesTable.ownerId, session.userId)))
    if (!file) {
        throw new Error("File not found")
    }
    if (!file) {
        return { error: "File not found" }
    }
    const utapiResults = await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")])
    console.log(utapiResults)

    const dbDeleteResults = await db.delete(filesTable).where(eq(filesTable.id, fileId))
    console.log(dbDeleteResults)

    const c = await cookies()
    c.set("force-refresh", JSON.stringify(Math.random()))

    return { success: true }
}