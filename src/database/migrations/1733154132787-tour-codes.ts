import { MigrationInterface, QueryRunner } from "typeorm";

export class TourCodes1733154132787 implements MigrationInterface {
    name = 'TourCodesANDSettingsFix1733154132787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "inviteLink"`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "inviteCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "inviteCode"`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "inviteLink" character varying`);
    }

}
