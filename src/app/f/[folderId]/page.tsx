import { getAllParentsForFolder, getFiles, getFolders } from "~/server/queries"
import DriveContents from "../../drive-contents"

export default async function GoogleDriveClone({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = await params
    const parsedFolderId = parseInt(folderId)
    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }
    const [files, folders, parents] = await Promise.all([
        getFiles(parsedFolderId),
        getFolders(parsedFolderId),
        getAllParentsForFolder(parsedFolderId)])

    return <DriveContents files={files} folders={folders} parents={parents} />
}