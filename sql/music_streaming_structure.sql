/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 90605
 Source Host           : localhost
 Source Database       : music_streaming
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90605
 File Encoding         : utf-8

 Date: 12/08/2017 17:19:55 PM
*/

-- ----------------------------
--  Table structure for albums
-- ----------------------------
DROP TABLE IF EXISTS "public"."albums";
CREATE TABLE "public"."albums" (
	"alid" varchar(64) NOT NULL COLLATE "default",
	"altitle" varchar(64) NOT NULL COLLATE "default",
	"aldate" date
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."albums" OWNER TO "postgres";

-- ----------------------------
--  Table structure for artists
-- ----------------------------
DROP TABLE IF EXISTS "public"."artists";
CREATE TABLE "public"."artists" (
	"aid" varchar(64) NOT NULL COLLATE "default",
	"aname" varchar(64) NOT NULL COLLATE "default",
	"adesc" varchar(518) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."artists" OWNER TO "postgres";

-- ----------------------------
--  Table structure for tracks
-- ----------------------------
DROP TABLE IF EXISTS "public"."tracks";
CREATE TABLE "public"."tracks" (
	"tid" varchar(64) NOT NULL COLLATE "default",
	"ttile" varchar(64) COLLATE "default",
	"tduration" int4,
	"tgenre" varchar(518) COLLATE "default",
	"aid" varchar(64) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."tracks" OWNER TO "postgres";

-- ----------------------------
--  Table structure for follow
-- ----------------------------
DROP TABLE IF EXISTS "public"."follow";
CREATE TABLE "public"."follow" (
	"follower_usrname" varchar(64) NOT NULL COLLATE "default",
	"followee_usrname" varchar(64) NOT NULL COLLATE "default",
	"fldate" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."follow" OWNER TO "postgres";

-- ----------------------------
--  Table structure for rating
-- ----------------------------
DROP TABLE IF EXISTS "public"."rating";
CREATE TABLE "public"."rating" (
	"username" varchar(64) NOT NULL COLLATE "default",
	"tid" varchar(64) NOT NULL COLLATE "default",
	"rtime" timestamp(6) NOT NULL,
	"score" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."rating" OWNER TO "postgres";

-- ----------------------------
--  Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
	"username" varchar(64) NOT NULL COLLATE "default",
	"password" varchar(128) NOT NULL COLLATE "default",
	"uname" varchar(64) COLLATE "default",
	"uemail" varchar(64) COLLATE "default",
	"ucity" varchar(64) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."users" OWNER TO "postgres";

-- ----------------------------
--  Table structure for favorite
-- ----------------------------
DROP TABLE IF EXISTS "public"."favorite";
CREATE TABLE "public"."favorite" (
	"username" varchar(64) NOT NULL COLLATE "default",
	"aid" varchar(64) NOT NULL COLLATE "default",
	"frdate" timestamp(6) NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."favorite" OWNER TO "postgres";

-- ----------------------------
--  Table structure for tracks_playing
-- ----------------------------
DROP TABLE IF EXISTS "public"."tracks_playing";
CREATE TABLE "public"."tracks_playing" (
	"username" varchar(64) NOT NULL COLLATE "default",
	"tid" varchar(64) NOT NULL COLLATE "default",
	"tptime" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."tracks_playing" OWNER TO "postgres";

-- ----------------------------
--  Table structure for playlists
-- ----------------------------
DROP TABLE IF EXISTS "public"."playlists";
CREATE TABLE "public"."playlists" (
	"pid" varchar(64) NOT NULL COLLATE "default",
	"ptitle" varchar(64) COLLATE "default",
	"pdate" date,
	"pstatus" varchar(64) COLLATE "default",
	"username" varchar(64) COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."playlists" OWNER TO "postgres";

-- ----------------------------
--  Table structure for playlists_playing
-- ----------------------------
DROP TABLE IF EXISTS "public"."playlists_playing";
CREATE TABLE "public"."playlists_playing" (
	"username" varchar(64) NOT NULL COLLATE "default",
	"pid" varchar(64) NOT NULL COLLATE "default",
	"pptime" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."playlists_playing" OWNER TO "postgres";

-- ----------------------------
--  Table structure for playlist_contains
-- ----------------------------
DROP TABLE IF EXISTS "public"."playlist_contains";
CREATE TABLE "public"."playlist_contains" (
	"pid" varchar(64) NOT NULL COLLATE "default",
	"tid" varchar(64) NOT NULL COLLATE "default",
	"sequence_in_playlist" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."playlist_contains" OWNER TO "postgres";

-- ----------------------------
--  Table structure for album_contains
-- ----------------------------
DROP TABLE IF EXISTS "public"."album_contains";
CREATE TABLE "public"."album_contains" (
	"alid" varchar(64) NOT NULL COLLATE "default",
	"tid" varchar(64) NOT NULL COLLATE "default",
	"sequence_in_album" int4
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."album_contains" OWNER TO "postgres";

-- ----------------------------
--  Primary key structure for table albums
-- ----------------------------
ALTER TABLE "public"."albums" ADD PRIMARY KEY ("alid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table albums
-- ----------------------------
CREATE UNIQUE INDEX  "albums_alid_key" ON "public"."albums" USING btree(alid COLLATE "default" "pg_catalog"."text_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD PRIMARY KEY ("aid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table artists
-- ----------------------------
CREATE UNIQUE INDEX  "artists_aid_key" ON "public"."artists" USING btree(aid COLLATE "default" "pg_catalog"."text_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table tracks
-- ----------------------------
ALTER TABLE "public"."tracks" ADD PRIMARY KEY ("tid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table tracks
-- ----------------------------
CREATE UNIQUE INDEX  "tracks_tid_key" ON "public"."tracks" USING btree(tid COLLATE "default" "pg_catalog"."text_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table follow
-- ----------------------------
ALTER TABLE "public"."follow" ADD PRIMARY KEY ("follower_usrname", "followee_usrname") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table rating
-- ----------------------------
ALTER TABLE "public"."rating" ADD PRIMARY KEY ("username", "tid", "rtime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD PRIMARY KEY ("username") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX  "users_username_key" ON "public"."users" USING btree(username COLLATE "default" "pg_catalog"."text_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table favorite
-- ----------------------------
ALTER TABLE "public"."favorite" ADD PRIMARY KEY ("username", "aid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table tracks_playing
-- ----------------------------
ALTER TABLE "public"."tracks_playing" ADD PRIMARY KEY ("username", "tid", "tptime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table playlists
-- ----------------------------
ALTER TABLE "public"."playlists" ADD PRIMARY KEY ("pid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table playlists
-- ----------------------------
CREATE UNIQUE INDEX  "playlists_pid_key" ON "public"."playlists" USING btree(pid COLLATE "default" "pg_catalog"."text_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table playlists_playing
-- ----------------------------
ALTER TABLE "public"."playlists_playing" ADD PRIMARY KEY ("username", "pid", "pptime") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table playlist_contains
-- ----------------------------
ALTER TABLE "public"."playlist_contains" ADD PRIMARY KEY ("pid", "tid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table album_contains
-- ----------------------------
ALTER TABLE "public"."album_contains" ADD PRIMARY KEY ("alid", "tid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table tracks
-- ----------------------------
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_aid_fkey" FOREIGN KEY ("aid") REFERENCES "public"."artists" ("aid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table follow
-- ----------------------------
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_followee_usrname_fkey" FOREIGN KEY ("followee_usrname") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_follower_usrname_fkey" FOREIGN KEY ("follower_usrname") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table rating
-- ----------------------------
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_tid_fkey" FOREIGN KEY ("tid") REFERENCES "public"."tracks" ("tid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."rating" ADD CONSTRAINT "rating_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table favorite
-- ----------------------------
ALTER TABLE "public"."favorite" ADD CONSTRAINT "favorite_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table tracks_playing
-- ----------------------------
ALTER TABLE "public"."tracks_playing" ADD CONSTRAINT "tracks_playing_tid_fkey" FOREIGN KEY ("tid") REFERENCES "public"."tracks" ("tid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."tracks_playing" ADD CONSTRAINT "tracks_playing_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table playlists
-- ----------------------------
ALTER TABLE "public"."playlists" ADD CONSTRAINT "playlists_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table playlists_playing
-- ----------------------------
ALTER TABLE "public"."playlists_playing" ADD CONSTRAINT "playlists_playing_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."playlists_playing" ADD CONSTRAINT "playlists_playing_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."playlists" ("pid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table playlist_contains
-- ----------------------------
ALTER TABLE "public"."playlist_contains" ADD CONSTRAINT "playlist_contains_tid_fkey" FOREIGN KEY ("tid") REFERENCES "public"."tracks" ("tid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."playlist_contains" ADD CONSTRAINT "playlist_contains_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."playlists" ("pid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table album_contains
-- ----------------------------
ALTER TABLE "public"."album_contains" ADD CONSTRAINT "album_contains_alid_fkey" FOREIGN KEY ("alid") REFERENCES "public"."albums" ("alid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."album_contains" ADD CONSTRAINT "album_contains_tid_fkey" FOREIGN KEY ("tid") REFERENCES "public"."tracks" ("tid") ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

