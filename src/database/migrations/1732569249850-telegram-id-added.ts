import { MigrationInterface, QueryRunner } from "typeorm";

export class TelegramIdAdded1732569249850 implements MigrationInterface {
    name = 'TelegramIdAdded1732569249850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "telegramId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telegramId"`);
    }

}
