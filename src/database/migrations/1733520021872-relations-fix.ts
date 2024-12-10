import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationsFix1733520021872 implements MigrationInterface {
    name = 'RelationsFix1733520021872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_maps" DROP CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_455280b7d03c0f059927350c49d"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_b81685c4f0e99e561836cea447b"`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" DROP CONSTRAINT "FK_dc4310a1cbaea780766763a98fa"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_56d61850223447c3b8900979dec"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_b70d3f076c0616152e0caddaaff"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_5f190100cd36e84037db31a784f"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_7b834f84e7c07302249e9b2975f"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "event_maps" ADD CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_455280b7d03c0f059927350c49d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_b81685c4f0e99e561836cea447b" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" ADD CONSTRAINT "FK_dc4310a1cbaea780766763a98fa" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_56d61850223447c3b8900979dec" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_b70d3f076c0616152e0caddaaff" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_5f190100cd36e84037db31a784f" FOREIGN KEY ("eventMapId") REFERENCES "event_maps"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98" FOREIGN KEY ("methodId") REFERENCES "withdrawal_methods"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_7b834f84e7c07302249e9b2975f" FOREIGN KEY ("methodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_7b834f84e7c07302249e9b2975f"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e"`);
        await queryRunner.query(`ALTER TABLE "withdrawals" DROP CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_5f190100cd36e84037db31a784f"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_b70d3f076c0616152e0caddaaff"`);
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "FK_56d61850223447c3b8900979dec"`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" DROP CONSTRAINT "FK_dc4310a1cbaea780766763a98fa"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_b81685c4f0e99e561836cea447b"`);
        await queryRunner.query(`ALTER TABLE "wins" DROP CONSTRAINT "FK_455280b7d03c0f059927350c49d"`);
        await queryRunner.query(`ALTER TABLE "event_maps" DROP CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_7b834f84e7c07302249e9b2975f" FOREIGN KEY ("methodId") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_79a3949e02a4652fb2b2a0ccd4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawals" ADD CONSTRAINT "FK_a2ae7fbb7c7467548b102ca9c98" FOREIGN KEY ("methodId") REFERENCES "withdrawal_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_5f190100cd36e84037db31a784f" FOREIGN KEY ("eventMapId") REFERENCES "event_maps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_b70d3f076c0616152e0caddaaff" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "FK_56d61850223447c3b8900979dec" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tournament_chat_messages" ADD CONSTRAINT "FK_dc4310a1cbaea780766763a98fa" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_b81685c4f0e99e561836cea447b" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wins" ADD CONSTRAINT "FK_455280b7d03c0f059927350c49d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_maps" ADD CONSTRAINT "FK_1cc2752ff83dd1f2ee773048e1c" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
