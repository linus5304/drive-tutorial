"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import type { filesTable, foldersTable } from "~/server/db/schema"
import { FileRow, FolderRow } from "./file-row"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"

export default function DriveContents(props: {
  files: typeof filesTable.$inferSelect[];
  folders: typeof foldersTable.$inferSelect[];
  parents: typeof foldersTable.$inferSelect[];
  currentFolderId: number;
}) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/f/1"
              className="text-gray-300 hover:text-white mr-2"
            >
              My Drive
            </Link>
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
        <UploadButton
          endpoint="driveUploader"
          onClientUploadComplete={() => { router.refresh() }}
          input={{
            folderId: props.currentFolderId
          }} />
      </div>
    </div>
  )
}


