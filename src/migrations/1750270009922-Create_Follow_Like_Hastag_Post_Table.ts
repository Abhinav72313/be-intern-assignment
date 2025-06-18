import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollowLikeHastagPostTable1750270009922 implements MigrationInterface {
    name = 'CreateFollowLikeHastagPostTable1750270009922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_7fedde18872deb14e4889361d7b" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "post_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_723da61de46f65bb3e3096750d2" UNIQUE ("user_id", "post_id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "author_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "follower_id" integer NOT NULL, "following_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8109e59f691f0444b43420f6987" UNIQUE ("follower_id", "following_id"))`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("post_id" integer NOT NULL, "hashtag_id" integer NOT NULL, PRIMARY KEY ("post_id", "hashtag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c16a0f366b0642259bbe50481" ON "post_hashtags" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_41f5ee7a97e67023d7461fa8f4" ON "post_hashtags" ("hashtag_id") `);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "post_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_723da61de46f65bb3e3096750d2" UNIQUE ("user_id", "post_id"), CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("id", "user_id", "post_id", "createdAt") SELECT "id", "user_id", "post_id", "createdAt" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "author_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "author_id", "createdAt", "updatedAt") SELECT "id", "content", "author_id", "createdAt", "updatedAt" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "follower_id" integer NOT NULL, "following_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8109e59f691f0444b43420f6987" UNIQUE ("follower_id", "following_id"), CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("id", "follower_id", "following_id", "createdAt") SELECT "id", "follower_id", "following_id", "createdAt" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
        await queryRunner.query(`DROP INDEX "IDX_6c16a0f366b0642259bbe50481"`);
        await queryRunner.query(`DROP INDEX "IDX_41f5ee7a97e67023d7461fa8f4"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_hashtags" ("post_id" integer NOT NULL, "hashtag_id" integer NOT NULL, CONSTRAINT "FK_6c16a0f366b0642259bbe50481c" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_41f5ee7a97e67023d7461fa8f43" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("post_id", "hashtag_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_post_hashtags"("post_id", "hashtag_id") SELECT "post_id", "hashtag_id" FROM "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_hashtags" RENAME TO "post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_6c16a0f366b0642259bbe50481" ON "post_hashtags" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_41f5ee7a97e67023d7461fa8f4" ON "post_hashtags" ("hashtag_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_41f5ee7a97e67023d7461fa8f4"`);
        await queryRunner.query(`DROP INDEX "IDX_6c16a0f366b0642259bbe50481"`);
        await queryRunner.query(`ALTER TABLE "post_hashtags" RENAME TO "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("post_id" integer NOT NULL, "hashtag_id" integer NOT NULL, PRIMARY KEY ("post_id", "hashtag_id"))`);
        await queryRunner.query(`INSERT INTO "post_hashtags"("post_id", "hashtag_id") SELECT "post_id", "hashtag_id" FROM "temporary_post_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE INDEX "IDX_41f5ee7a97e67023d7461fa8f4" ON "post_hashtags" ("hashtag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6c16a0f366b0642259bbe50481" ON "post_hashtags" ("post_id") `);
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "follower_id" integer NOT NULL, "following_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8109e59f691f0444b43420f6987" UNIQUE ("follower_id", "following_id"))`);
        await queryRunner.query(`INSERT INTO "follows"("id", "follower_id", "following_id", "createdAt") SELECT "id", "follower_id", "following_id", "createdAt" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "author_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "author_id", "createdAt", "updatedAt") SELECT "id", "content", "author_id", "createdAt", "updatedAt" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "post_id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_723da61de46f65bb3e3096750d2" UNIQUE ("user_id", "post_id"))`);
        await queryRunner.query(`INSERT INTO "likes"("id", "user_id", "post_id", "createdAt") SELECT "id", "user_id", "post_id", "createdAt" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`DROP INDEX "IDX_41f5ee7a97e67023d7461fa8f4"`);
        await queryRunner.query(`DROP INDEX "IDX_6c16a0f366b0642259bbe50481"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
    }

}
