import { QUERIES } from "~/server/queries"
import DriveContents from "../../(home)/drive-contents"

export default async function GoogleDriveClone({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params
    const parsedFolderId = parseInt(folderId)
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }
    const [files, folders, parents] = await Promise.all([
        QUERIES.getFiles(parsedFolderId),
        QUERIES.getFolders(parsedFolderId),
        QUERIES.getAllParentsForFolder(parsedFolderId)])

    return <DriveContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} />
}