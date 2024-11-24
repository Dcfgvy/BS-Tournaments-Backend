import { MigrationInterface, QueryRunner } from "typeorm";

export class NamesInManyLanguagesPaymentMethods1732454750611 implements MigrationInterface {
    name = 'NamesInManyLanguagesPaymentMethods1732454750611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "names" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "descriptions" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "names" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "descriptions" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "descriptions"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "names"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "descriptions"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "names"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "name" character varying NOT NULL`);
    }

}
