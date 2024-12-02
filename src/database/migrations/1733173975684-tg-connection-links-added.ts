import { MigrationInterface, QueryRunner } from "typeorm";

export class TgConnectionLinksAdded1733173975684 implements MigrationInterface {
    name = 'TgConnectionLinksAdded1733173975684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_connection_links" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "uid" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_3fa9e46b3839004a28a51d63803" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "telegram_connection_links" ADD CONSTRAINT "FK_ee29bebfaecf6e0ff26f273cada" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_connection_links" DROP CONSTRAINT "FK_ee29bebfaecf6e0ff26f273cada"`);
        await queryRunner.query(`DROP TABLE "telegram_connection_links"`);
    }

}
