import { AppDataSource } from "./orm-config";

export async function withTransaction<T>(
  callback: (repository: any) => Promise<T>,
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export function formatEntity<T>(entity: T): T {
  // Remove any sensitive or unnecessary fields
  if (entity && typeof entity === "object") {
    const { ...rest } = entity as any;
    return rest;
  }
  return entity;
}
