import { MigrationInterface, QueryRunner } from "typeorm";

export class TgChannelsForPostingAdded1733263321224 implements MigrationInterface {
    name = 'TgChannelsForPostingAdded1733263321224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channels_to_post" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying NOT NULL, "language" character varying NOT NULL, CONSTRAINT "PK_35dee00fa92552c6432e8f78499" PRIMARY KEY ("username"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "channels_to_post"`);
    }

}
