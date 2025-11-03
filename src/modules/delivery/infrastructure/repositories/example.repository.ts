import { ExampleConverter } from "../converters/example.converter";
import { ExampleEntity } from "../entities/example.entity";

// ExampleRepository
export class ExampleRepository {
  constructor(
    private readonly converter: ExampleConverter,
    private readonly entity: ExampleEntity,
  ) {}

  async create(entity: ExampleEntity): Promise<ExampleEntity> {
    const raw = this.converter.toPersistence(entity);
    // TODO: Save raw to database
    return this.converter.toDomain(raw);
  }
}