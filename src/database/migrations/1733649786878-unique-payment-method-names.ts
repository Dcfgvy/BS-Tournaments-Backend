import { MigrationInterface, QueryRunner } from "typeorm";

export class UniquePaymentMethodNames1733649786878 implements MigrationInterface {
    name = 'UniquePaymentMethodNames1733649786878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD CONSTRAINT "UQ_63017f69e8782a6e2356da417ac" UNIQUE ("methodName")`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "UQ_9d53f91562ae32055c50eeec6e1" UNIQUE ("methodName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "UQ_9d53f91562ae32055c50eeec6e1"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP CONSTRAINT "UQ_63017f69e8782a6e2356da417ac"`);
    }

}
