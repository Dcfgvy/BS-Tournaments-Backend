import { MigrationInterface, QueryRunner } from "typeorm";

export class MapsPostImageUrlAdded1733349043347 implements MigrationInterface {
    name = 'MapsPostImageUrlAdded1733349043347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_maps" ADD "postImgUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_maps" DROP COLUMN "postImgUrl"`);
    }

}
