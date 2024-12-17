import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceComissionsAdded1734455929768 implements MigrationInterface {
    name = 'ServiceComissionsAdded1734455929768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "serviceComission" numeric(10,2) NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "serviceComission" numeric(10,2) NOT NULL DEFAULT 0`);

        // Update the 'serviceComission' column to have the same value as 'comission'
        await queryRunner.query(`
            UPDATE "payment_methods"
            SET "serviceComission" = "comission"
        `);
        await queryRunner.query(`
            UPDATE "withdrawal_methods"
            SET "serviceComission" = "comission"
        `);

        // Remove the DEFAULT value after populating data
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "serviceComission" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "serviceComission" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "serviceComission"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "serviceComission"`);
    }

}
