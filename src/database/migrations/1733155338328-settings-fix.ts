import { MigrationInterface, QueryRunner } from "typeorm";

export class SettingsFix1733155338328 implements MigrationInterface {
    name = 'SettingsFix1733155338328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "value" TYPE text`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "value" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "value" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "value" DROP NOT NULL`);
    }

}