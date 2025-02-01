import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { filesTable } from "~/server/db/schema";
import { foldersTable } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function SandboxPage() {
    const user = await auth()
    if (!user.userId) {
        throw new Error("User not found")
    }
    const folders = await db.select().from(foldersTable).where(eq(foldersTable.ownerId, user.userId))
    console.log(folders)
    return (
        <div>
            seed function
            <form action={async () => {
                "use server"
                const user = await auth()
                if (!user.userId) {
                    throw new Error("User not found")
                }

                const rootFolder = await db.insert(foldersTable).values({
                    name: "root",
                    parent: null,
                    ownerId: user.userId
                }).$returningId()

                await db.insert(foldersTable).values(mockFolders.map((folder, index) => ({
                    name: folder.name,
                    parent: rootFolder[0]!.id,
                    ownerId: user.userId
                })));
            }}>
                <button type="submit">Seed</button>
            </form>
        </div>
    )
}
