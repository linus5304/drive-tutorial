import { db } from "~/server/db"
import { filesTable, foldersTable } from "~/server/db/schema"
import DriveContents from "../../drive-contents"
import { eq } from "drizzle-orm"

async function getAllParents(folderId: number) {
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
}

export default async function GoogleDriveClone({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params
    const parsedFolderId = parseInt(folderId)
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }
    const filesPromise = db.select().from(filesTable).where(eq(filesTable.parent, parsedFolderId))
    const foldersPromise = db.select().from(foldersTable).where(eq(foldersTable.parent, parsedFolderId))
    const parentsPromise = getAllParents(parsedFolderId)
    const [files, folders, parents] = await Promise.all([filesPromise, foldersPromise, parentsPromise])

    return <DriveContents files={files} folders={folders} parents={parents} />
}