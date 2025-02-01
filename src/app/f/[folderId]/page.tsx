import { db } from "~/server/db"
import { filesTable, foldersTable } from "~/server/db/schema"
import DriveContents from "../../drive-contents"
import { eq } from "drizzle-orm"

export default async function GoogleDriveClone({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params
    const parsedFolderId = parseInt(folderId)
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }
    const files = await db.select().from(filesTable).where(eq(filesTable.parent, parsedFolderId))
    const folders = await db.select().from(foldersTable).where(eq(foldersTable.parent, parsedFolderId))

    return <DriveContents files={files} folders={folders} />
}