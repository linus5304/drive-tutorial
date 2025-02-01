import "server-only"

import { db } from "~/server/db"
import { DB_FileType, filesTable, foldersTable } from "~/server/db/schema"
import { eq } from "drizzle-orm"

export const QUERIES = {
    getFiles: async (folderId: number) => {
        return db.select().from(filesTable).where(eq(filesTable.parent, folderId)).orderBy(filesTable.id)
    },
    getFolders: async (folderId: number) => {
        return db.select().from(foldersTable).where(eq(foldersTable.parent, folderId)).orderBy(foldersTable.id)
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
    getFolderById: async (folderId: number) => {
        const folder = await db.select().from(foldersTable).where(eq(foldersTable.id, folderId))
        if (!folder[0]) {
            throw new Error("Folder not found")
        }
        return folder[0]
    }
}

export const MUTATIONS = {
    createFile: async (input: {
        file: {
            name: string,
            url: string,
            parent: number,
            size: number
        },
        userId: string
    }) => {
        const { file, userId } = input

        return db.insert(filesTable).values({
            ...file,
            ownerId: userId
        })
    }
}