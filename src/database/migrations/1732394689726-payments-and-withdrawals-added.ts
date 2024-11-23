import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentsAndWithdrawalsAdded1732394689726 implements MigrationInterface {
    name = 'PaymentsAndWithdrawalsAdded1732394689726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "paymentId" TO "methodId"`);
        await queryRunner.query(`CREATE TABLE "withdrawal_methods" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "imgUrl" character varying NOT NULL, "comission" numeric(10,2) NOT NULL, CONSTRAINT "PK_770cde47c6c03d39272b8f19a31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdrawals" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" integer NOT NULL, "methodId" integer, "userId" integer, CONSTRAINT "PK_9871ec481baa7755f8bd8b7c7e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "imgUrl" character varying NOT NULL, "comission" numeric(10,2) NOT NULL, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "methodId"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "methodId" integer`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98" FOREIGN KEY ("methodId") REFERENCES "withdrawal_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_7b834f84e7c07302249e9b2975f" FOREIGN KEY ("methodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_7b834f84e7c07302249e9b2975f"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "methodId"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "methodId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TABLE "withdrawals"`);
        await queryRunner.query(`DROP TABLE "withdrawal_methods"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "methodId" TO "paymentId"`);
    }

}
