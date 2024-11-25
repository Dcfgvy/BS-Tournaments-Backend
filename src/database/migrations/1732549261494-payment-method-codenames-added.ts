import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentMethodCodenamesAdded1732549261494 implements MigrationInterface {
    name = 'PaymentMethodCodenamesAdded1732549261494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ADD "methodName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "methodName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "methodName"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" DROP COLUMN "methodName"`);
    }

}
