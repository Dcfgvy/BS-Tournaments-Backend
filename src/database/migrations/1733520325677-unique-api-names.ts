import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueApiNames1733520325677 implements MigrationInterface {
    name = 'UniqueApiNames1733520325677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "UQ_f7588c0f01944df4b0dbb4ff785" UNIQUE ("apiName")`);
        await queryRunner.query(`ALTER TABLE "event_maps" ADD CONSTRAINT "UQ_fe61d8f9d793eb8f1b355697189" UNIQUE ("apiName")`);
        await queryRunner.query(`ALTER TABLE "brawlers" ADD CONSTRAINT "UQ_2d6965bddac0a28d91bf2bf7822" UNIQUE ("apiName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brawlers" DROP CONSTRAINT "UQ_2d6965bddac0a28d91bf2bf7822"`);
        await queryRunner.query(`ALTER TABLE "event_maps" DROP CONSTRAINT "UQ_fe61d8f9d793eb8f1b355697189"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "UQ_f7588c0f01944df4b0dbb4ff785"`);
    }

}
