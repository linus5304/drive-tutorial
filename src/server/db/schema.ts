import { bigint, index, int, singlestoreTableCreator, text } from 'drizzle-orm/singlestore-core';

export const createTable = singlestoreTableCreator((name) => `drive-tutorial_${name}`);

export const filesTable = createTable('files_table', {
  id: bigint("id", { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", { mode: 'number', unsigned: true }).notNull(),
  size: int("size").notNull()
}, (t) => {
  return [
    index("parent_index").on(t.parent)
  ]
});

export const foldersTable = createTable('folders_table', {
  id: bigint("id", { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: 'number', unsigned: true }),
}, (t) => {
  return [
    index("parent_index").on(t.parent)
  ]
});