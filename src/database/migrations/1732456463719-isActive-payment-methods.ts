import { MigrationInterface, QueryRunner } from "typeorm";

export class IsActivePaymentMethods1732456463719 implements MigrationInterface {
    name = 'IsActivePaymentMethods1732456463719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "names" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "descriptions" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "names" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "descriptions" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "descriptions"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "names"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "descriptions"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "names"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "name" character varying NOT NULL`);
    }

}
