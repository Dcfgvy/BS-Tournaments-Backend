import { MigrationInterface, QueryRunner } from "typeorm";

export class NamesFromStringsToJsons1736624919769 implements MigrationInterface {
    name = 'NamesFromStringsToJsons1736624919769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "names" TYPE jsonb USING "names"::jsonb`);
        await queryRunner.query(`ALTER TABLE "event_maps" ALTER COLUMN "names" TYPE jsonb USING "names"::jsonb`);
        await queryRunner.query(`ALTER TABLE "brawlers" ALTER COLUMN "names" TYPE jsonb USING "names"::jsonb`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "names" TYPE jsonb USING "names"::jsonb`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "descriptions" TYPE jsonb USING "descriptions"::jsonb`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "names" TYPE jsonb USING "names"::jsonb`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "descriptions" TYPE jsonb USING "descriptions"::jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "descriptions" TYPE text USING "descriptions"::text`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "names" TYPE character varying USING "names"::text`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "descriptions" TYPE text USING "descriptions"::text`);
        await queryRunner.query(`ALTER TABLE "withdrawal_methods" ALTER COLUMN "names" TYPE character varying USING "names"::text`);
        await queryRunner.query(`ALTER TABLE "brawlers" ALTER COLUMN "names" TYPE character varying USING "names"::text`);
        await queryRunner.query(`ALTER TABLE "event_maps" ALTER COLUMN "names" TYPE character varying USING "names"::text`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "names" TYPE character varying USING "names"::text`);
    }
}
