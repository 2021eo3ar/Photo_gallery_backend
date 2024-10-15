import { relations, sql } from "drizzle-orm";
import { pgTable,serial,varchar,timestamp, integer } from "drizzle-orm/pg-core";


export const users:any = pgTable("users", {
    id : serial("id").primaryKey(),
    userName : varchar("userName",{length:255}).notNull(),
    email : varchar("email",{length:255}).notNull().unique(),
    password: varchar("password",{length:255}).notNull(),
    createdAt : timestamp("createdAt").default(sql`NOW()`),
    updatedAt : timestamp("updatedAt").default(sql`NOW()`),
})

export const gallerys = pgTable("gallerys",{
    id: serial("id").primaryKey(),
    imageUrl:varchar("imageUrl").notNull(),
    userId : integer("userId").references(()=>users.id).notNull()
})

export const userRelations = relations(users,({many})=>({
    gallery:many(gallerys)
}))

export const galleryRelations = relations(gallerys,({one})=>({
    user:one(users,{
        fields : [gallerys.userId],
        references:[users.id]
    })
}))