import "server-only"

import { db } from "~/server/db"
import { filesTable, foldersTable } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export const QUERIES = {
    getFiles: async (folderId: number) => {
        return db.select().from(filesTable).where(eq(filesTable.parent, folderId))
    },
    getFolders: async (folderId: number) => {
        return db.select().from(foldersTable).where(eq(foldersTable.parent, folderId))
    },
    getAllParentsForFolder: async (folderId: number) => {
        const parents = []
        let currentId: number | null = folderId
        while (currentId !== null) {
            const folder = await db.select().from(foldersTable).where(eq(foldersTable.id, currentId))
            if (!folder[0]) {
                throw new Error("Parent folder not found")
            }
            parents.unshift(folder[0])
            currentId = folder[0]?.parent
        }
        return parents
    },
}