import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732458848176 implements MigrationInterface {
    name = 'InitialMigration1732458848176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "tag" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', "language" character varying NOT NULL DEFAULT 'ru', "ip" character varying NOT NULL, "roles" integer array NOT NULL DEFAULT '{0}', "isBanned" boolean NOT NULL DEFAULT false, "bannedUntil" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_bdaf727e265d0bf8493b0fb4760" UNIQUE ("tag"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "names" character varying NOT NULL, "imgUrl" character varying NOT NULL, "apiName" character varying NOT NULL, "isSolo" boolean NOT NULL DEFAULT false, "teamSize" integer, "playersNumberOptions" integer array NOT NULL, "isDisabled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_maps" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "names" character varying NOT NULL, "imgUrl" character varying NOT NULL, "apiName" character varying NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_89b4bc93b5113a05a4af1ed66ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brawlers" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "names" character varying NOT NULL, "imgUrl" character varying NOT NULL, "apiName" character varying NOT NULL, "isDisabled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c85f70837d958f419e61bad92a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournament_chat_messages" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "text" text NOT NULL, "userId" integer, "tournamentId" integer, CONSTRAINT "PK_bbe08b332c69840350d3ff19509" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournaments" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "entryCost" integer NOT NULL, "playersNumber" integer NOT NULL, "prizes" integer array NOT NULL, "status" integer NOT NULL, "inviteLink" character varying, "lastStatusUpdate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "organizerId" integer, "eventId" integer, "eventMapId" integer, CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wins" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "place" integer NOT NULL, "userId" integer, "tournamentId" integer, CONSTRAINT "PK_b3458264724f58a0153dda58904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdrawal_methods" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "names" character varying NOT NULL, "descriptions" text NOT NULL, "imgUrl" character varying NOT NULL, "comission" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_770cde47c6c03d39272b8f19a31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "names" character varying NOT NULL, "descriptions" text NOT NULL, "imgUrl" character varying NOT NULL, "comission" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdrawals" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" integer NOT NULL, "methodId" integer, "userId" integer, CONSTRAINT "PK_9871ec481baa7755f8bd8b7c7e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" integer NOT NULL, "methodId" integer, "userId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tournaments_banned_brawlers_brawlers" ("tournamentsId" integer NOT NULL, "brawlersId" integer NOT NULL, CONSTRAINT "PK_02c6c9cdd165dff6b497527d148" PRIMARY KEY ("tournamentsId", "brawlersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c39fb3ce034acdb795a2bac0d9" ON "tournaments_banned_brawlers_brawlers" ("tournamentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ca8a5d41421d1b51fed70118a1" ON "tournaments_banned_brawlers_brawlers" ("brawlersId") `);
        await queryRunner.query(`CREATE TABLE "tournaments_contestants_users" ("tournamentsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_e30c5aee614a85354415b414783" PRIMARY KEY ("tournamentsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0746e125b7522c1cca31b7a5d4" ON "tournaments_contestants_users" ("tournamentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_204822e3fc1a788a4c582f7103" ON "tournaments_contestants_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "event_maps" ADD CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" ADD CONSTRAINT "FK_3ee1b9f98198e8fadced00985e5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" ADD CONSTRAINT "FK_dc4310a1cbaea780766763a98fa" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_56d61850223447c3b8900979dec" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_b70d3f076c0616152e0caddaaff" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_5f190100cd36e84037db31a784f" FOREIGN KEY ("eventMapId") REFERENCES "event_maps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_455280b7d03c0f059927350c49d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_b81685c4f0e99e561836cea447b" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98" FOREIGN KEY ("methodId") REFERENCES "withdrawal_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_7b834f84e7c07302249e9b2975f" FOREIGN KEY ("methodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments_banned_brawlers_brawlers" ADD CONSTRAINT "FK_c39fb3ce034acdb795a2bac0d9e" FOREIGN KEY ("tournamentsId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournaments_banned_brawlers_brawlers" ADD CONSTRAINT "FK_ca8a5d41421d1b51fed70118a18" FOREIGN KEY ("brawlersId") REFERENCES "brawlers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournaments_contestants_users" ADD CONSTRAINT "FK_0746e125b7522c1cca31b7a5d46" FOREIGN KEY ("tournamentsId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournaments_contestants_users" ADD CONSTRAINT "FK_204822e3fc1a788a4c582f71038" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments_contestants_users" DROP CONSTRAINT "FK_204822e3fc1a788a4c582f71038"`);
        await queryRunner.query(`ALTER TABLE "tournaments_contestants_users" DROP CONSTRAINT "FK_0746e125b7522c1cca31b7a5d46"`);
        await queryRunner.query(`ALTER TABLE "tournaments_banned_brawlers_brawlers" DROP CONSTRAINT "FK_ca8a5d41421d1b51fed70118a18"`);
        await queryRunner.query(`ALTER TABLE "tournaments_banned_brawlers_brawlers" DROP CONSTRAINT "FK_c39fb3ce034acdb795a2bac0d9e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_7b834f84e7c07302249e9b2975f"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_b81685c4f0e99e561836cea447b"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_455280b7d03c0f059927350c49d"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_5f190100cd36e84037db31a784f"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_b70d3f076c0616152e0caddaaff"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_56d61850223447c3b8900979dec"`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" DROP CONSTRAINT "FK_dc4310a1cbaea780766763a98fa"`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" DROP CONSTRAINT "FK_3ee1b9f98198e8fadced00985e5"`);
        await queryRunner.query(`ALTER TABLE "event_maps" DROP CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_204822e3fc1a788a4c582f7103"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0746e125b7522c1cca31b7a5d4"`);
        await queryRunner.query(`DROP TABLE "tournaments_contestants_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca8a5d41421d1b51fed70118a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c39fb3ce034acdb795a2bac0d9"`);
        await queryRunner.query(`DROP TABLE "tournaments_banned_brawlers_brawlers"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "withdrawals"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TABLE "withdrawal_methods"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "wins"`);
        await queryRunner.query(`DROP TABLE "tournaments"`);
        await queryRunner.query(`DROP TABLE "tournament_chat_messages"`);
        await queryRunner.query(`DROP TABLE "brawlers"`);
        await queryRunner.query(`DROP TABLE "event_maps"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
