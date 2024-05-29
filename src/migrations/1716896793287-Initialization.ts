import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialization1716896793287 implements MigrationInterface {
  name = "Initialization1716896793287";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "thread" ("id" SERIAL NOT NULL, "content" text NOT NULL, "image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `INSERT INTO "thread" ("content") VALUES ('Hellow'), ('Hollow'), ('Halaw'), ('Hehew'), ('Hohow'), ('Hihiw'), ('Howo'), ('Hawawa')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "thread"`);
  }
}
