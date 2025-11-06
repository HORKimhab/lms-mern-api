import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1762391285706 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id CHAR(36) NOT NULL PRIMARY KEY, -- UUID
                userName VARCHAR(100) NOT NULL,
                userEmail VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                avatarPublicId VARCHAR(255),
                avatarSecureUrl TEXT,
                role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
                subscriptionId VARCHAR(255),
                subscriptionStatus ENUM('active', 'cancelled', 'inactive') NOT NULL DEFAULT 'inactive',
                forgotPasswordToken VARCHAR(255),
                forgotPasswordExpiry TIMESTAMP,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }

}
