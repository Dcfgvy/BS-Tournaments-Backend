import { MigrationInterface, QueryRunner } from "typeorm";

export class MinMaxPaymentMethodAmounts1732737748984 implements MigrationInterface {
    name = 'MinMaxPaymentMethodAmounts1732737748984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "minAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "maxAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "minAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "maxAmount" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "maxAmount"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "minAmount"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "maxAmount"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "minAmount"`);
    }

}
