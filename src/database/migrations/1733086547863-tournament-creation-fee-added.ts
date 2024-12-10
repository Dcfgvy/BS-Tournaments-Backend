import { MigrationInterface, QueryRunner } from "typeorm";

export class TournamentCreationFeeAdded1733086547863 implements MigrationInterface {
    name = 'TournamentCreationFeeAdded1733086547863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" ADD "feeToPay" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" DROP COLUMN "feeToPay"`);
    }

}
