import { db } from "~/server/db"
import { filesTable, foldersTable } from "~/server/db/schema"
import DriveContents from "./drive-contents"

export default async function GoogleDriveClone() {
  const files = await db.select().from(filesTable)
  const folders = await db.select().from(foldersTable)

  return <DriveContents files={files} folders={folders} />
}


