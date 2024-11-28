import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableImagesPaymentMethods1732788378952 implements MigrationInterface {
    name = 'NullableImagesPaymentMethods1732788378952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "imgUrl" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "imgUrl" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "imgUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "imgUrl" SET NOT NULL`);
    }

}
