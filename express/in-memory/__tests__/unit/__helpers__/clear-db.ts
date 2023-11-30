import { getConnection } from "typeorm";

afterEach(async () => {
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.clear();
  }
});
