import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueTgId1733161746321 implements MigrationInterface {
    name = 'UniqueTgId1733161746321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "telegramId" TYPE bigint USING "telegramId"::bigint`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_df18d17f84763558ac84192c754" UNIQUE ("telegramId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_df18d17f84763558ac84192c754"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "telegramId" TYPE character varying USING "telegramId"::character varying`);
    }

}
